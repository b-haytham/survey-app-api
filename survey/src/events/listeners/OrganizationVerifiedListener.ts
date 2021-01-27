import { Listener, OrganizationVerifiedEvent, Subjects } from "@dabra/survey_common";
import { Message } from "node-nats-streaming";

import Organization from "../../models/Organization";

export class OrganizationVerifiedListener extends Listener<OrganizationVerifiedEvent> {
    subject: Subjects.ORGANIZATION_VERIFIED = Subjects.ORGANIZATION_VERIFIED
    queueGroupName = "survey-service"

    async onMessage(data: OrganizationVerifiedEvent['data'], msg: Message) {
        const existingOrg = await Organization.findOne({ _id: data.id, version: data.version - 1 })

        if(!existingOrg) {
            throw new Error('Organization do not exists')
        }

        existingOrg.isVerified = true
                
        await existingOrg.save()

        msg.ack()
    }
}