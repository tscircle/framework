import {jobInterface} from '../../queue/jobInterface';

export class failingJob implements jobInterface{

    myObj;

    public constructor(myObj) {

        this.myObj = myObj;
    }

    public async handle() {
        throw new Error('failed');
    }
}
