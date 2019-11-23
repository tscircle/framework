import {database} from "../database/database";

export abstract class BaseModel {
    public static primaryIdColumn: string = "id";
    public static parentIdColumn: string = "id";
    public static tableName: string = "";

    public static q() {
        return database(this.tableName);
    }

    public static find(id: number) {
        return this.q()
            .where({id: id})
            .first()
            .catch(error => console.log(error));
    }

    public static update(id: number, data: object) {
        return this.q()
            .where({id: id})
            .update(data)
            .catch(error => console.log(error));
    }

    public static create(data: object) {
        return this.q()
            .insert(data)
            .catch(error => console.log(error));
    }

    public static delete(id: number) {
        return this.q()
            .where({id: id})
            .delete()
            .catch(error => console.log(error));
    }

    public static updateOrCreate(lookup: object, insert: object) {
        return this.q().where(lookup).update({...lookup, ...insert})
            .then((res) => {
                if (!res) {
                    return this.q().insert(Object.assign(lookup, insert));
                }
            }).then(() => {
                return this.q().where(lookup).first()
            })
    };
}
