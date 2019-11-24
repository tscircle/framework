import * as StorageManager from '@slynova/flydrive';
import config from '@tscircle/config/storage';
const storage = new StorageManager(config);

export const Storage = storage.disk();


