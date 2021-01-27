
import { AdminVerifiedEvent, Listener, Subjects } from "@dabra/survey_common";
import { Message } from "node-nats-streaming";

import Admin from "../../models/Admin";

export class AdminVerifiedListener extends Listener<AdminVerifiedEvent> {
    subject: Subjects.ADMIN_VERIFIED = Subjects.ADMIN_VERIFIED
    queueGroupName = "survey-service"

    async onMessage(data: AdminVerifiedEvent['data'], msg: Message) {
        const existingAdmin = await Admin.findOne({ _id: data.id, version: data.version - 1 })

        if(!existingAdmin) {
            throw new Error('Admin do not exists')
        }

        existingAdmin.isVerified = true
                
        await existingAdmin.save()

        msg.ack()
    }
}