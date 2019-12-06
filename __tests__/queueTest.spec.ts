import {expect} from 'chai';
import 'mocha';
import {Queue} from "../queue/queue";
import {myJobJob} from "../application/jobs/myJob.job";
import {failingJob} from "../application/jobs/failingJob.job";
import {FailedJob} from "../queue/failedJob";


describe('Queue tests', () => {
    it('should fetch the job', () => {
        return Queue.dispatch((new myJobJob({email: 'test'})))
            .then(() => {
                return new Promise((resolve) => setTimeout(resolve, 300))
                    .then(() => {
                        return Queue.fetchJobs()
                    });
            }).then((res) => {
                expect(res).to.not.be.empty;
            }).then(() => {
                return Queue.fetchJobs();
            }).then((res) => {
                expect(res).to.not.be.undefined;
            })
    });

    it('should put the job to the failed jobs table (dld)', () => {
        return Queue.dispatch((new failingJob({email: 'test'})))
            .then(() => {
                return new Promise((resolve) => setTimeout(resolve, 500))
                    .then(() => {
                        return Queue.fetchJobs();
                    });
            }).then((res) => {
                expect(res).to.not.be.empty;
            }).then(() => {
                return Queue.fetchJobs();
            }).then(() => {
                return FailedJob.q().first()
                    .then((failedJob) => {
                        expect(failedJob).to.not.be.empty;
                    })
            }).then(() => {
                return Queue.fetchJobs();
            }).then(() => {
                return Queue.fetchJobs();
            }).then(() => {
                return Queue.fetchJobs();
            }).then(() => {
                return FailedJob.q().first()
                    .then((failedJob) => {
                        expect(failedJob.name).to.be.eql('failingJob');
                    })
            }).then(() => {
                return Queue.fetchJobs();
            }).then((res) => {
                expect(res).to.not.be.undefined;
            })
    });
});
