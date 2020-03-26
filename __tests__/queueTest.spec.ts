import { expect } from 'chai';
import 'mocha';
import { Queue } from "../queue/queue";
import { myJobJob } from "../application/jobs/myJob.job";
import { failingJob } from "../application/jobs/failingJob.job";
import { FailedJob } from "../queue/failedJob";


describe('Queue tests', () => {
    it('should fetch the job', () => {
        return Queue.dispatch(myJobJob, { email: 'test' })
            .then(() => {
                return Queue.getQueueAttributes()
                    .then((res) => {
                        expect(res['ApproximateNumberOfMessages']).to.be.eql('1')
                    })
            })
            .then(() => {
                return Queue.fetchJobs()
            }).then((res) => {
                return Queue.getQueueAttributes()
                    .then((res) => {
                        expect(res['ApproximateNumberOfMessages']).to.be.eql('0')
                    })
            });
    });

    it('should put the job to the failed jobs table (dld)', () => {
        return Queue.dispatch(failingJob, { email: 'test' })
            .then(() => {
                return Queue.fetchJobs();
            }).then((res) => {
                return Queue.getQueueAttributes()
                    .then((res) => {
                        expect(res['ApproximateNumberOfMessagesNotVisible']).to.be.eql('1')
                    })
            });
        /* TODO Mock somehow to skip invisibility timeout
        .then(() => {
            return Queue.fetchJobs();
        }).then(() => {
            return FailedJob.q().first()
                .then((failedJob) => {
                    expect(failedJob).to.be.empty;
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
            return Queue.getQueueAttributes()
                .then((res) => {
                    expect(res['ApproximateNumberOfMessages']).to.be.eql('0')
                })
        })
        */
    });
});
