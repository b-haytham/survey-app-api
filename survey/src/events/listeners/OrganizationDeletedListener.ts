
import { AdminDeletedEvent, AdminUpdatedEvent, Listener, OrganizationDeletedEvent, Subjects } from "@dabra/survey_common";
import { Message } from "node-nats-streaming";

import Admin from "../../models/Admin";
import Organization from "../../models/Organization";

export class OrganizationDeletedListener extends Listener<OrganizationDeletedEvent> {
    subject: Subjects.ORGANIZATION_DELETED = Subjects.ORGANIZATION_DELETED
    queueGroupName = "survey-service"

    async onMessage(data: OrganizationDeletedEvent['data'], msg: Message) {
        const existingOrg = await Organization.findOne({ _id: data.id })

        if(!existingOrg) {
            throw new Error('Organization do not exists')
        }

        await Organization.deleteOne({ _id: data.id })

        msg.ack()
    }
}