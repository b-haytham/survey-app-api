
import { AdminDeletedEvent, AdminUpdatedEvent, Listener, Subjects } from "@dabra/survey_common";
import { Message } from "node-nats-streaming";

import Admin from "../../models/Admin";

export class AdminDeletedListener extends Listener<AdminDeletedEvent> {
    subject: Subjects.ADMIN_DELETED = Subjects.ADMIN_DELETED
    queueGroupName = "survey-service"

    async onMessage(data: AdminDeletedEvent['data'], msg: Message) {
        const existingAdmin = await Admin.findOne({ _id: data.id })

        if(!existingAdmin) {
            throw new Error('Admin do not exists')
        }

        await Admin.deleteOne({ _id: data.id })

        msg.ack()
    }
}