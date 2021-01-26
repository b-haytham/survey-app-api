
import {  Listener, OrganizationCreatedEvent, Subjects } from "@dabra/survey_common";
import { Message } from "node-nats-streaming";

import Organization from "../models/Organization";

export class OrganizationCreatedListener extends Listener<OrganizationCreatedEvent> {
    subject: Subjects.ORGANIZATION_CREATED = Subjects.ORGANIZATION_CREATED
    queueGroupName = "mailer-service"

    async onMessage(data: OrganizationCreatedEvent['data'], msg: Message) {
        const existingOrg = await Organization.findById(data.id)

        if(existingOrg) {
            throw new Error('Organization Already exist')
        }

        const org = Organization.build({
            orgId: data.id,
            isVerified: data.isVerified,
            role: data.role,
            version: data.version,
            email: data.email
        })

        await org.save()

        msg.ack()
    }
}