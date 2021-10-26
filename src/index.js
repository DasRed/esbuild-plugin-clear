import fs from 'fs';

export default (path) => {
    return {
        name:  'Clear',
        setup: (build) => {
            build.onStart(() => {
                if (fs.existsSync(path)) {
                    fs.rmSync(path, {recursive: true});
                }
            });
        },
    };
}
