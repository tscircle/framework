import * as StorageManager from '@slynova/flydrive';

import getConfig from "../config/config";
const config = getConfig('storage');

const storage = new StorageManager(config);

export const Storage = storage.disk();


