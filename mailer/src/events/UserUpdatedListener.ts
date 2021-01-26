
import { Listener, Subjects, UserUpdatedEvent } from "@dabra/survey_common";
import { Message } from "node-nats-streaming";

import User from "../models/User";

export class UserUpdatedListener extends Listener<UserUpdatedEvent> {
    subject: Subjects.USER_UPDATED = Subjects.USER_UPDATED
    queueGroupName = "mailer-service"

    async onMessage(data: UserUpdatedEvent['data'], msg: Message) {
        const existingUser = await User.findOne({ _id: data.id, version: data.version - 1 })

        if(!existingUser) {
            throw new Error('User do not exists')
        }

        existingUser.isVerified = data.isVerified
        existingUser.role = data.role
        existingUser.version = data.version
        
        await existingUser.save()

        msg.ack()
    }
}