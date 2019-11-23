import {BaseRepository} from "../../../../repository/baseRepository";
import {EmailType} from "../models/emailTypeModel";
import {EntityRootsIdsRepositoryInterface} from "../../../repositories/entityRootsIdsInterface";

export class EmailTypeRepository extends BaseRepository implements EntityRootsIdsRepositoryInterface{
    model = EmailType;

    getEntityRootsIds = async (parentId: number, id: number) => {
        return this.model.q()
            .select('team.id as teamId', 'team.company_id as companyId')
            .join('project', 'email_type.project_id', '=', 'project.id')
            .join('team', 'project.team_id', '=', 'team.id')
            .where('email_type.project_id', parentId)
            .modify((query) => {
                if (id) {
                    query.where('email_type.id', id)
                }
            })
            .first();
    };
}
