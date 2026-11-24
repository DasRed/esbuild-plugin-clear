export default interface ClearPluginOptionInterface {
    /** Allows deleting a path outside the working directory of the build. */
    allowOutsideWorkingDir?: boolean;
    /** Path to delete, relative to the working directory of the build. Defaults to the output folder (outdir or the folder of outfile). */
    path?: string;
}
