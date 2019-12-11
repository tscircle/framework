import {ControllerException} from "../http/controllers/baseController";
import {BaseRepository} from "./baseRepository";

export class xStateRepository extends BaseRepository {
    model: any;
    statesModel: BaseRepository;
    xstateColumn: 'data';

    //TODO Add common subquery functionality to BaseModel ?
    //autoJoin()

    public async getSMInstance(id: number) {
        const sm = await this.get(id);
        Xstate.build(sm[this.xstateColumn])
    }


    public async storeSMInstance(id: number) {
        const staes = Xstate.build(sm[this.xstateColumn])
        const sm = await this.get(id);
    }

    public async storeSMSATE(data: Object) {
        const staes = Xstate.get(sm[this.xstateColumn])
        const sm = await this.update(id); ??
    }



    public async get(id: number) {
        return this.model
            .q()
            .where({[this.model.primaryIdColumn]: id})
            .first()
            .catch(error => {
                throw <ControllerException>{
                    status: 400,
                    error: error
                };
            });
    }

    public async getAll(searchQuery?: string, searchColumn?: string) {
        return this.model
            .q()
            .modify((query) => {
                if (searchQuery && searchColumn) {
                    query.where(searchColumn, 'like', '%' + searchQuery + '%')
                }
            })
            .catch(error => {
                throw <ControllerException>{
                    status: 400,
                    error: error
                };
            });
    }

    public async add(data: object) {
        return this.model
            .create(data)
            .catch(error => {
                throw <ControllerException>{
                    status: 400,
                    error: error
                };
            });
    }

    public async edit(id: number, data: object) {
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

    public async delete(id: number) {
        return this.model
            .q()
            .where({[this.model.primaryIdColumn]: id})
            .delete()
            .catch(error => {
                throw <ControllerException>{
                    status: 400,
                    error: error
                };
            });
    }
}
