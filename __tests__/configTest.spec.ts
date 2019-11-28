import {expect} from 'chai';
import 'mocha';
import config from "../config/config";
import * as fs from 'fs';


describe('Config tests', () => {
    it('should return a cache config object', () => {
        expect(config('cache')).to.have.property('default');
    });

    it('should return a config object from a path generated via environment variables', (done) => {
        const FILE_CONTENT = "export default {hello: 'tscricle'};";
        const FILENAME = 'message';
        const FILE_EXTENSION = 'ts';
        const CONFIG_FOLDER = '__tests__/';

        const FILE_PATH = CONFIG_FOLDER + FILENAME + '.' + FILE_EXTENSION;

        process.env.CONFIG_DIR = CONFIG_FOLDER;
        process.env.CONFIG_FILE_EXTENSION = FILE_EXTENSION;

        fs.writeFile(FILE_PATH, FILE_CONTENT, function () {
            expect(config(FILENAME)).to.have.property('hello');
            fs.unlink(FILE_PATH, () => {
                done();
            });
        });
    });
});
