
import { AdminCreatedEvent, Listener, Subjects } from "@dabra/survey_common";
import { Message } from "node-nats-streaming";

import Admin from "../../models/Admin";

export class AdminCreatedListener extends Listener<AdminCreatedEvent> {
    subject: Subjects.ADMIN_CREATED = Subjects.ADMIN_CREATED
    queueGroupName = "survey-service"

    async onMessage(data: AdminCreatedEvent['data'], msg: Message) {
        const existingAdmin = await Admin.findById(data.id)

        if(existingAdmin) {
            throw new Error('Admin Already exist')
        }

        const admin = Admin.build({
            adminId: data.id,
            isVerified: data.isVerified,
            role: data.role,
            version: data.version
        })

        await admin.save()

        msg.ack()
    }
}