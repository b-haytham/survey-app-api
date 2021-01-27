
import { AdminUpdatedEvent, Listener, Subjects } from "@dabra/survey_common";
import { Message } from "node-nats-streaming";

import Admin from "../../models/Admin";

export class AdminUpdatedListener extends Listener<AdminUpdatedEvent> {
    subject: Subjects.ADMIN_UPDATED = Subjects.ADMIN_UPDATED
    queueGroupName = "survey-service"

    async onMessage(data: AdminUpdatedEvent['data'], msg: Message) {
        const existingAdmin = await Admin.findOne({ _id: data.id, version: data.version - 1 })

        if(!existingAdmin) {
            throw new Error('Admin do not exists')
        }

        existingAdmin.isVerified = data.isVerified
        existingAdmin.role = data.role
        existingAdmin.version = data.version
        
        await existingAdmin.save()

        msg.ack()
    }
}