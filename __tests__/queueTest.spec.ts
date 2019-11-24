import {expect} from 'chai';
import 'mocha';
import {Queue} from "../queue/queue";
import {myJobJob} from "../application/jobs/myJob.job";


describe('Queue tests', () => {
    it('should fetch the job', () => {
        return Queue.dispatch((new myJobJob({email: 'test'})))
            .then(() => {
                return Queue.fetchJobs();
            }).then((res) => {
                expect(res).to.not.be.empty;
            })
    });
});
