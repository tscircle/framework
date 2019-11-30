import {idSchema} from "../../schemas/crudSchema";
import {baseController} from "./baseController";
import {BaseRepository} from "../../repository/baseRepository";

const express = require("express");
const serverless = require("serverless-http");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.json());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Credentials", true);
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

export class CrudController extends baseController {
    route: string;
    essence: BaseRepository;

    onStoreValidationSchema: object;
    onUpdateValidationSchema: object;

    constructor(route: string, essence: BaseRepository) {
        super();

        this.essence = essence;
        this.route = route;
    }

    public setupRestHandler() {
        this.setupAPIHandler();

        return serverless(app);
    }

    public setupAPIHandler() {
        const {route} = this;

        app.get(`/${route}`, this.index);
        app.get(`/${route}/:id`, this.show);
        app.post(`/${route}`, this.store);
        app.put(`/${route}/:id`, this.update);
        app.delete(`/${route}/:id`, this.remove);

        return app;
    }

    private index = async (req, res) => {
        return this.prerequisites(req).then(async () => {
            const parentId = req.params.parentId || null;
            const searchQuery = req.query.searchQuery || null;
            const searchColumn = req.query.searchColumn || null;
            const response = await this.essence.getAll(searchQuery, searchColumn, parentId);

            return res.json(response);
        }).catch((error) => {
            res.status(error.status).send(error.error);
        });
    };

    private show = async (req, res) => {
        return this.prerequisites(req).then(async () => {
            const id = req.params.id;
            const parentId = req.params.parentId || null;
            this.validate({id: id}, idSchema);
            const response = await this.essence.get(id, parentId);

            return res.json(response);
        }).catch((error) => {
            res.status(error.status).json(error.error);
        });
    };

    public store = async (req, res) => {
        return this.prerequisites(req).then(async () => {
            this.validate(req.body, this.onStoreValidationSchema);
            const parentId = req.params.parentId || null;
            const response = await this.essence.add(req.body, parentId);
            return res.status(201).json(response);
        }).catch((error) => {
            res.status(error.status).json(error.error);
        });
    };

    private update = async (req, res) => {
        return this.prerequisites(req).then(async () => {
            const id = req.params.id;

            this.validate(req.body, this.onUpdateValidationSchema);
            const parentId = req.params.parentId || null;
            const response = await this.essence.edit(id, req.body, parentId);

            return res.status(202).json(response);
        }).catch((error) => {
            res.status(error.status).json(error.error);
        });
    };

    private remove = async (req, res) => {
        return this.prerequisites(req).then(async () => {
            const id = req.params.id;

            this.validate({id: id}, idSchema);
            const parentId = req.params.parentId || null;
            const response = await this.essence.delete(id, parentId);

            return res.status(204).json(response);
        }).catch((error) => {
            res.status(error.status).json(error.error);
        });
    };
};

export default app;
