import clear from '@/clear';
import esbuild, {type BuildOptions, type OnStartResult, type PluginBuild} from 'esbuild';
import fs from 'node:fs';
import fsPromises from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';

type OnStartCallbackType = () => Promise<OnStartResult>;

let workingDir: string;

function run(options: Parameters<typeof clear>[0], initialOptions: BuildOptions = {}): Promise<OnStartResult> {
    let callback: OnStartCallbackType | undefined;

    const build = {
        initialOptions: {absWorkingDir: workingDir, ...initialOptions},
        onStart:        (onStart: OnStartCallbackType): void => {
            callback = onStart;
        },
    } as unknown as PluginBuild;

    void clear(options).setup(build);

    if (callback === undefined) {
        throw new Error('onStart was not registered');
    }

    return callback();
}

function write(file: string): string {
    const fullPath = path.join(workingDir, file);
    fs.mkdirSync(path.dirname(fullPath), {recursive: true});
    fs.writeFileSync(fullPath, file);

    return fullPath;
}

beforeEach(() => {
    workingDir = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'esbuild-plugin-clear-')));
});

afterEach(() => {
    vi.restoreAllMocks();
    fs.rmSync(workingDir, {force: true, recursive: true});
});

describe('clear', () => {
    it('returns a plugin named clear', () => {
        expect(clear('./dist').name).toBe('clear');
    });

    it('deletes the path given as string', async () => {
        write('dist/index.js');
        write('dist/nested/old.js');
        write('src/index.ts');

        await expect(run('./dist')).resolves.toEqual({});

        expect(fs.existsSync(path.join(workingDir, 'dist'))).toBe(false);
        expect(fs.existsSync(path.join(workingDir, 'src/index.ts'))).toBe(true);
    });

    it('deletes the path given as option', async () => {
        write('public/build/app.js');

        await expect(run({path: 'public/build'})).resolves.toEqual({});

        expect(fs.existsSync(path.join(workingDir, 'public/build'))).toBe(false);
        expect(fs.existsSync(path.join(workingDir, 'public'))).toBe(true);
    });

    it('deletes a single file', async () => {
        write('dist/index.js');

        await expect(run('dist/index.js')).resolves.toEqual({});

        expect(fs.existsSync(path.join(workingDir, 'dist/index.js'))).toBe(false);
        expect(fs.existsSync(path.join(workingDir, 'dist'))).toBe(true);
    });

    it('uses outdir without a path', async () => {
        write('out/a.js');

        await expect(run(undefined, {outdir: './out', outfile: './other/index.js'})).resolves.toEqual({});

        expect(fs.existsSync(path.join(workingDir, 'out'))).toBe(false);
    });

    it('uses the folder of outfile without a path', async () => {
        write('dist/index.js');

        await expect(run({}, {outfile: './dist/index.js'})).resolves.toEqual({});

        expect(fs.existsSync(path.join(workingDir, 'dist'))).toBe(false);
    });

    it('fails without path, outdir and outfile', async () => {
        await expect(run({})).resolves.toEqual({errors: [{text: 'No path given and the build has neither outdir nor outfile.'}]});
    });

    it('fails with an empty path', async () => {
        await expect(run('')).resolves.toEqual({errors: [{text: 'No path given and the build has neither outdir nor outfile.'}]});
    });

    it.each(['.', './', '..', '../..', '/'])('refuses to delete the working directory or a parent: %s', async (target) => {
        write('src/index.ts');

        const result = await run(target);

        expect(result.errors?.[0]?.text).toMatch(/^Refusing to delete ".+", it is the working directory or one of its parents\.$/);
        expect(fs.existsSync(path.join(workingDir, 'src/index.ts'))).toBe(true);
    });

    it('refuses the folder of an outfile in the working directory', async () => {
        const result = await run(undefined, {outfile: './index.js'});

        expect(result.errors?.[0]?.text).toContain('it is the working directory or one of its parents');
    });

    it('refuses to delete a path outside of the working directory', async () => {
        const outside = fs.mkdtempSync(path.join(os.tmpdir(), 'esbuild-plugin-clear-outside-'));

        try {
            const result = await run(outside);

            expect(result.errors?.[0]?.text).toBe(`Refusing to delete "${outside}", it is outside of the working directory "${workingDir}". Set allowOutsideWorkingDir to allow it.`);
            expect(fs.existsSync(outside)).toBe(true);
        }
        finally {
            fs.rmSync(outside, {force: true, recursive: true});
        }
    });

    it('refuses a sibling folder with the same prefix', async () => {
        const result = await run(`../${path.basename(workingDir)}-dist`);

        expect(result.errors?.[0]?.text).toContain('it is outside of the working directory');
    });

    it('deletes a path outside of the working directory with allowOutsideWorkingDir', async () => {
        const outside = fs.mkdtempSync(path.join(os.tmpdir(), 'esbuild-plugin-clear-outside-'));
        fs.writeFileSync(path.join(outside, 'a.js'), 'a');

        await expect(run({allowOutsideWorkingDir: true, path: outside})).resolves.toEqual({});

        expect(fs.existsSync(outside)).toBe(false);
    });

    it('still refuses a parent of the working directory with allowOutsideWorkingDir', async () => {
        const result = await run({allowOutsideWorkingDir: true, path: '..'});

        expect(result.errors?.[0]?.text).toContain('it is the working directory or one of its parents');
    });

    it('deletes a folder whose name starts with two dots', async () => {
        write('..cache/a.js');

        await expect(run('..cache')).resolves.toEqual({});

        expect(fs.existsSync(path.join(workingDir, '..cache'))).toBe(false);
    });

    it('ignores a missing path', async () => {
        await expect(run('./dist')).resolves.toEqual({});
    });

    it('uses the current directory without absWorkingDir', async () => {
        write('dist/index.js');
        vi.spyOn(process, 'cwd').mockReturnValue(workingDir);

        await expect(run('./dist', {absWorkingDir: undefined})).resolves.toEqual({});

        expect(fs.existsSync(path.join(workingDir, 'dist'))).toBe(false);
    });

    it('reports an error thrown while deleting', async () => {
        vi.spyOn(fsPromises, 'rm').mockRejectedValue(new Error('EBUSY'));

        await expect(run('./dist')).resolves.toEqual({errors: [{text: `Could not delete "${path.join(workingDir, 'dist')}": EBUSY`}]});
    });

    it('reports a non error value thrown while deleting', async () => {
        vi.spyOn(fsPromises, 'rm').mockRejectedValue('locked');

        await expect(run('./dist')).resolves.toEqual({errors: [{text: `Could not delete "${path.join(workingDir, 'dist')}": locked`}]});
    });
});

describe('clear with esbuild', () => {
    it('removes stale files before the build', async () => {
        write('src/index.js');
        write('dist/stale.js');

        await esbuild.build({
            absWorkingDir: workingDir,
            bundle:        true,
            entryPoints:   ['./src/index.js'],
            logLevel:      'silent',
            outfile:       './dist/index.js',
            plugins:       [clear()],
        });

        expect(fs.existsSync(path.join(workingDir, 'dist/stale.js'))).toBe(false);
        expect(fs.existsSync(path.join(workingDir, 'dist/index.js'))).toBe(true);
    });

    it('clears before every rebuild', async () => {
        write('src/index.js');

        const context = await esbuild.context({
            absWorkingDir: workingDir,
            entryPoints:   ['./src/index.js'],
            logLevel:      'silent',
            outdir:        './dist',
            plugins:       [clear('./dist')],
        });

        try {
            await context.rebuild();
            write('dist/stale.js');
            await context.rebuild();
        }
        finally {
            await context.dispose();
        }

        expect(fs.existsSync(path.join(workingDir, 'dist/stale.js'))).toBe(false);
        expect(fs.existsSync(path.join(workingDir, 'dist/index.js'))).toBe(true);
    });

    it('fails the build for a dangerous path', async () => {
        write('src/index.js');

        await expect(esbuild.build({
            absWorkingDir: workingDir,
            entryPoints:   ['./src/index.js'],
            logLevel:      'silent',
            outfile:       './dist/index.js',
            plugins:       [clear('.')],
        })).rejects.toThrow('it is the working directory or one of its parents');

        expect(fs.existsSync(path.join(workingDir, 'src/index.js'))).toBe(true);
    });
});
