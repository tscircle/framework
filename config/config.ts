import * as path from "path";

export default function (name: string) {
    const CONFIG_DIR = process.env.CONFIG_DIR || 'application/config';
    const APP_PATH = process.env.CONFIG_APP_PATH || process.cwd();
    const FILE_EXTENSION = process.env.CONFIG_FILE_EXTENSION || 'ts';

    const FILE_PATH = path.join(APP_PATH, CONFIG_DIR, name + '.' + FILE_EXTENSION);

    return require(FILE_PATH).default;
};
