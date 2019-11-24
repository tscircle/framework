import {jobInterface} from '../../queue/jobInterface';

export class myJobJob implements jobInterface{

    myObj;

    public constructor(myObj) {

        this.myObj = myObj;
    }

    public handle() {
        console.log('yeah handle this thing');
    }
}
