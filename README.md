# tscircle/framework 
This repository contains the core code of the tscircle framework.
[Here](https://github.com/tscircle/boilerplate) is boilerplate to run this framework. 

[![CircleCI](https://circleci.com/gh/tscircle/framework.svg?style=svg)](https://circleci.com/gh/tscircle/framework)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=tscircle_framework&metric=alert_status)](https://sonarcloud.io/dashboard?id=tscircle_framework)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=tscircle_framework&metric=coverage)](https://sonarcloud.io/dashboard?id=tscircle_framework)
[![Known Vulnerabilities](https://snyk.io/test/github/tscircle/framework/badge.svg?targetFile=package.json)](https://snyk.io/test/github/tscircle/framework?targetFile=package.json)

## local development 
```
docker-compose up -d 
docker-compose exec node bash
$docker:npm install
$docker:npm npm run tests
```

## Database
application/domain/users/models/user.model.ts

```
User.q().where('column', '=', 'foo').first().then((column) => {}); 

User.updateOrCreate(['column', 'foo'], ['column2', 'newValue']);

User.find(1).then((item) => {});
```

### Migration commands 
```
$npm run migrate:make my_table_creation_description

$npm run migrate:make migrate:latest

$npm run migrate:make migrate:rollback
```
In the background knex is used.


## Storage
In the local development environment, the local ./storage folder is used and in an AWS environment the S3 the bucket, created in the Cloudformation script, is used.
[Flydrive](https://github.com/Slynova-Org/flydrive) is used as filesystem abstraction manager.


```
import {Storage} from '@tscricle/framework/storage/storage';

Storage.put('message.txt', 'Hello Node');

Storage.get('message.txt').then((content)=> {console.log(content.toString())});
```

## Cache
The docker container amazon/dynamodb-local is used locally. In an AWS environment the generated DynamoDB table is used.

```
import {Cache} from '@tscricle/framework/cache/cache';

const ttlInSeconds = 60;

Cachce.remember('cache-key', ttlInSeconds, () => { return 'cache-valuee'});
```

## Queue
The docker container vsouza/sqs-local is used locally. In an AWS environment the generated SQS queue together with a dead letter queue is used.

```
import {Queue} from "@tscricle/framework/queue/queue";
import {myJOb} from "../application/jobs/myJob";

return Queue.dispatch((new myJOb({email: 'test'})));
```
TODO improve tests

## BaseModel
https://github.com/tscircle/framework/blob/master/model/baseModel.ts

## BaseRepository
https://github.com/tscircle/framework/blob/master/repository/baseRepository.ts

## Base Controller
https://github.com/tscircle/framework/blob/master/http/controllers/baseController.ts

The base controller automatically calls the handler method.

```
functions:
  userRestEndpoint:
    handler: application/domain/user/controllers/userDownloadController.restHandler
    events:
    - http:
        path: /users/download
        method: GET
```

```
import {BaseController} from '@tscricle/framework/http/controllers/baseController';
export class EmailSpecialController extends BaseController {

    constructor() {
        super();
    }

}

exports.restHandler = new EmailSpecialController().setupRestHandler();
```

Validation can be done like this:
```
validationSchema = Joi.object().keys({
   name: Joi.string().alphanum().min(3).max(30).required(),
});
```

## CRUD Controller
https://github.com/tscircle/framework/blob/master/http/controllers/crudController.ts
The crud controller automatically performs crud operations on the provided model.

```
functions:
  userRestEndpoint:
    handler: application/domain/users/controllers/userController.restHandler
    events:
    - http:
        path: /users/{id}
        method: ANY
    - http:
        path: /users
        method: ANY
```


```
import {CrudController} from '@tscricle/framework/http/controllers/crudController';
import { UserRepository } from "../repositories/userRepository";

export class UserController extends CrudController {
    constructor() {
        super(new UserRepository());
    }
```

By default the following routes will be created:
```
app.get(`/${route}/`, this.index);
app.get(`/${route}/:id`, this.show);
app.post(`/${route}/`, this.store);
app.put(`/${route}/:id`, this.update);
app.delete(`/${route}/:id`, this.remove);
```


Validation can be done like this:
```
onStoreValidationSchema = userSchema;
onUpdateValidationSchema = editUserSchema;
}
```

Custom Routes can be added like this:
```
functions:
  userRestEndpoint:
    handler: application/domain/users/controllers/userController.restHandler
    events:
    - http:
        path: /clients/{id}/wallets/fees/
        method: ANY
    - http:
        path: /clients/{id}/profile/uploadProfilePicture
        method: ANY
```

```
import {CrudController} from '@tscricle/framework/http/controllers/crudController';
import { UserRepository } from "../repositories/userRepository";

export class UserController extends CrudController {
    constructor() {
        super(new UserRepository());

		get customRoutes(): CustomRoute[] {
          return [
            {
                route: '/clients/{id}/wallets/fees/',
                httpMethod: 'GET',
                method: this.getWalletsFees
            },
            {
                route: '/clients/{id}/profile/uploadProfilePicture',
                httpMethod: 'POST',
                method: this.uploadProfilePicture
            }
          ]
	    }
	    
		private getWalletsFees(event) {}
		//for files handler use multipart/form-data
		private uploadProfilePicture(event) {}
    }
```

## State Machine
There is an abstract state machine that can be easily implemented. 
The state machine is automatically persisted and rehydrated by the database.
This State Machine libraray is used: https://xstate.js.org/
Here you can find the abstract state machine:
https://github.com/tscircle/framework/blob/master/stateMachine/stateMachine.ts

Database: 
When creating an instance and executing a transition, the entry in the database is automatically changed. 
There are two tables: state_machine records the current state of all state machine instances. 
The table state_machine_history contains every change to a state machine.

To use own tables smRepository and smHistoryRepository can be overwritten in the implementation with own repositories.
```
protected smRepository: StateMachineRepository = new StateMachineRepository();
protected smHistoryRepository: StateMachineHistoryRepository = new StateMachineHistoryRepository();
```

Here is an example implementation:
```
export interface ProcessContext {
    amount: number;
    type: string;
}

export class processStateMachine extends stateMachine {

    public async create(context: ProcessContext) {
        return super.create(context);
    }

    protected config: MachineConfig<ProcessContext, any, any> = {
        id: 'quiet',
        initial: 'start',
        context: {
            amount: 0,
            type: ' yeah'
        },
        states: {
            start: {
                on: {
                    NEXT: 'waiting'
                }
            },
            waiting: {
                on: {
                    NEXT: 'paid'
                }
            },
            paid: {
                on: {
                    NEXT: 'finished'
                }
            },
            finished: {
                type: 'final'
            }
        }
    };
}
```

To create a new State Machine instance:
```
let sm = new processStateMachine();
await sm.create({
    amount: 1000,
    type: 'prepay',
});
```
or to rehydrate the State Machine instance with the ID 12 from the database:
```
let sm = new processStateMachine();
await sm.load(12);
```
The following call returns the instance ID:
```
await sm.getId();
```
To query the status object of an instance:
```
await sm.getStatus();
```
To execute a transition of the instance:
```
await sm.transition('NEXT');
```
