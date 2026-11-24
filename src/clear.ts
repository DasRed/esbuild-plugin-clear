import type ClearPluginOptionInterface from '@/ClearPluginOptionInterface';
import type {BuildOptions, OnStartResult, Plugin, PluginBuild} from 'esbuild';
import fs from 'node:fs/promises';
import path from 'node:path';

function getOutputDir({outdir, outfile}: BuildOptions): string | undefined {
    if (outdir !== undefined) {
        return outdir;
    }

    return outfile === undefined ? undefined : path.dirname(outfile);
}

function isInside(parent: string, child: string): boolean {
    const relative = path.relative(parent, child);

    return relative !== '' && relative !== '..' && relative.startsWith(`..${path.sep}`) === false && path.isAbsolute(relative) === false;
}

export default function clear(options: ClearPluginOptionInterface | string = {}): Plugin {
    const {allowOutsideWorkingDir = false, path: target} = typeof options === 'string' ? {path: options} : options;

    return {
        name:  'clear',
        setup: (build: PluginBuild): void => {
            build.onStart(async (): Promise<OnStartResult> => {
                const workingDir = build.initialOptions.absWorkingDir ?? process.cwd();
                const relative   = target ?? getOutputDir(build.initialOptions);
                if (relative === undefined || relative === '') {
                    return {errors: [{text: 'No path given and the build has neither outdir nor outfile.'}]};
                }

                const resolved = path.resolve(workingDir, relative);
                if (resolved === workingDir || isInside(resolved, workingDir)) {
                    return {errors: [{text: `Refusing to delete "${resolved}", it is the working directory or one of its parents.`}]};
                }

                if (allowOutsideWorkingDir === false && isInside(workingDir, resolved) === false) {
                    return {errors: [{text: `Refusing to delete "${resolved}", it is outside of the working directory "${workingDir}". Set allowOutsideWorkingDir to allow it.`}]};
                }

                try {
                    await fs.rm(resolved, {force: true, recursive: true});
                }
                catch (error) {
                    return {errors: [{text: `Could not delete "${resolved}": ${error instanceof Error ? error.message : String(error)}`}]};
                }

                return {};
            });
        },
    };
}
