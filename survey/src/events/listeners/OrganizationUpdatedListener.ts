
import { AdminUpdatedEvent, Listener, OrganizationUpdatedEvent, Subjects } from "@dabra/survey_common";
import { Message } from "node-nats-streaming";

import Admin from "../../models/Admin";
import Organization from "../../models/Organization";

export class OrganizationUpdatedListener extends Listener<OrganizationUpdatedEvent> {
    subject: Subjects.ORGANIZATION_UPDATED = Subjects.ORGANIZATION_UPDATED
    queueGroupName = "survey-service"

    async onMessage(data: OrganizationUpdatedEvent['data'], msg: Message) {
        const existingOrg = await Organization.findOne({ _id: data.id, version: data.version - 1 })

        if(!existingOrg) {
            throw new Error('Organization do not exists')
        }

        existingOrg.isVerified = data.isVerified
        existingOrg.role = data.role
        existingOrg.version = data.version
        
        await existingOrg.save()

        msg.ack()
    }
}