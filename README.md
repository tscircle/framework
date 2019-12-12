# tscircle/framework 
This repository contains the core code of the tscircle framework.
[Here](https://github.com/tscircle/boilerplate) is boilerplate to run this framework. 

[![CircleCI](https://circleci.com/gh/tscircle/framework.svg?style=svg)](https://circleci.com/gh/tscircle/framework)


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

## Base Controller
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
export class UserController extends BaseController {
    constructor() {
        super('post', 'email/:parentId/special');
    }
```

```
public handler = async (req): Promise<Object> => {
    return {
        hello: 'from EmailSpecialController'
    };
};
```


Validation can be done like this:
```
validationSchema = Joi.object().keys({
   name: Joi.string().alphanum().min(3).max(30).required(),
});
}
```

## CRUD Controller
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
export class UserController extends CrudController {
    constructor() {
        super("users", User);
    }
```

By default the following routes will be created:
@tscricle/framework/http/controllers/crudController.ts@setupAPIHandler:
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


