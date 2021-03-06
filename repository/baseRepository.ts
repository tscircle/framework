import {ControllerException} from "../http/controllers/baseController";
import {APIGatewayEvent} from "aws-lambda";

export abstract class BaseRepository {
    model: any;

    public async get(id: number, parentId?: number, event?: APIGatewayEvent) {
        return this.model
            .q()
            .where({[this.model.primaryIdColumn]: id})
            .modify((query) => {
                if (parentId) {
                    query.where({[this.model.parentIdColumn]: parentId})
                }
            })
            .first()
            .catch(error => {
                throw <ControllerException>{
                    status: 400,
                    error: error
                };
            });
    }

    public async getAllByIds(parentIds: [], event?: APIGatewayEvent) {
        return this.model
            .q()
            .whereIn(this.model.parentIdColumn, parentIds)
            .catch(error => {
                throw <ControllerException>{
                    status: 400,
                    error: error
                };
            });
    }

    public async getAll(searchQuery?: string, searchColumn?: string, parentId?: number, event?: APIGatewayEvent) {
        return this.model
            .q()
            .modify((query) => {
                if (searchQuery && searchColumn) {
                    query.where(searchColumn, 'like', '%' + searchQuery + '%')
                }
            })
            .modify((query) => {
                if (parentId) {
                    query.where({[this.model.parentIdColumn]: parentId})
                }
            })
            .catch(error => {
                throw <ControllerException>{
                    status: 400,
                    error: error
                };
            });
    }

    public async add(data: object, parentId?: number, event?: APIGatewayEvent) {
        if (parentId) {
            data = {...data, ...{[this.model.parentIdColumn]: parentId}};

            if (this.model.parentTakeOverColumns) {
                try {
                    const parent = await this.model.parentModel.find(parentId);
                    this.model.parentTakeOverColumns.forEach((item) => {
                        data[item.target] = parent[item.source];
                    });
                } catch (error) {
                    throw <ControllerException>{
                        status: 400,
                        error: error
                    };
                }
            }
        }

        return this.model
            .create(data)
            .catch(error => {
                throw <ControllerException>{
                    status: 400,
                    error: error
                };
            });
    }

    public async edit(id: number, data: object, parentId?: number, event?: APIGatewayEvent) {
        return this.model
            .update(id, data)
            .then(res => {
                if (!res) {
                    throw <ControllerException>{
                        status: 400,
                        error: new Error('Could not update')
                    };
                }
            })
            .catch(error => {
                throw <ControllerException>{
                    status: 400,
                    error: error
                };
            });
    }

    public async delete(id: number, parentId?: number, event?: APIGatewayEvent) {
        return this.model
            .q()
            .where({[this.model.primaryIdColumn]: id})
            .modify((query) => {
                if (parentId && false) {
                    query.where({[this.model.parentIdColumn]: parentId})
                }
            })
            .delete()
            .catch(error => {
                throw <ControllerException>{
                    status: 400,
                    error: error
                };
            });
    }
}
