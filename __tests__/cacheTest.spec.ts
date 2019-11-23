import {expect} from 'chai';
import 'mocha';
import {Cache} from "../cache/cache";


describe('Cache tests', () => {
    const cacheKey = 'test';
    const cacheValue = 'hello-cache';

    it('cache should return value from callback', () => {
        return Cache.remember(cacheKey, 30, async () => {
            return cacheValue;
        }).then((value) => {
            expect(value).to.eql(cacheValue);
        });
    });

    it('cache should return value from get method', async () => {
        return Cache.get(cacheKey).then((value) => {
            expect(value).to.eql(cacheValue);
        });
    });

    it('cache should return no value after remove', () => {
        return Cache.remember(cacheKey, 1, async () => {
            return cacheValue;
        }).then(() => {
            return Cache.remove(cacheKey);
        }).then(() => {
            return new Promise((resolve) => setTimeout(resolve, 50))
                .then(() => {
                    return Cache.get(cacheKey).then((value) => {
                        expect(value).to.eql(undefined);
                    });
                });
        });
    });

    it('cache should return no value after expiration', () => {
        return Cache.remember(cacheKey, 1, async () => {
            return new Promise((resolve) => setTimeout(resolve, 1000))
                .then(() => {
                    return Cache.get(cacheKey).then((value) => {
                        expect(value).to.eql(undefined);
                    });
                });
        });
    });

});
