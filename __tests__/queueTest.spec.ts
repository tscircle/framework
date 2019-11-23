import {expect} from 'chai';
import 'mocha';
import {Queue} from "../queue/queue";
import {myJOb} from "../application/jobs/myJob";


describe('Queue tests', () => {
    const cacheKey = 'test';
    const cacheValue = 'hello-cache';

    it('cache should xxx', () => {
        return Queue.dispatch((new myJOb({email: 'test'})))
            .then(() => {
                return Queue.fetchJobs();
            });
    });

});
