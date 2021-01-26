
import {  Listener, Subjects, UserCreatedEvent } from "@dabra/survey_common";
import { Message } from "node-nats-streaming";


import User from "../models/User";

export class UserCreatedListener extends Listener<UserCreatedEvent> {
    subject: Subjects.USER_CREATED = Subjects.USER_CREATED
    queueGroupName = "mailer-service"

    async onMessage(data: UserCreatedEvent['data'], msg: Message) {
        const existingUser = await User.findById(data.id)

        if(existingUser) {
            throw new Error('User Already exist')
        }

        const user = User.build({
            userId: data.id,
            isVerified: data.isVerified,
            role: data.role,
            version: data.version,
            email: data.email
        })

        await user.save()

        msg.ack()
    }
}