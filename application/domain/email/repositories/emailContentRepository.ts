import {BaseRepository} from "../../../../repository/baseRepository";
import {EmailContent} from "../models/emailContentModel";
import {EntityRootsIdsRepositoryInterface} from "../../../repositories/entityRootsIdsInterface";

export class EmailContentRepository extends BaseRepository implements EntityRootsIdsRepositoryInterface {
    model = EmailContent;

    getEntityRootsIds = async (parentId: number, id: number) => {
        return this.model.q()
            .select('team.id as teamId', 'team.company_id as companyId')
            .join('email', 'email_content.email_id', '=', 'email.id')
            .join('email_type', 'email.email_type_id', '=', 'email_type.id')
            .join('project', 'email_type.project_id', '=', 'project.id')
            .join('team', 'project.team_id', '=', 'team.id')
            .where('email_content.email_id', parentId)
            .modify((query) => {
                if (id) {
                    query.where('email_content.id', id)
                }
            })
            .first();
    };
}
