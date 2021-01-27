
import { Listener, Subjects, UserDeletedEvent } from "@dabra/survey_common";
import { Message } from "node-nats-streaming";

import User from "../../models/User";

export class UserDeletedListener extends Listener<UserDeletedEvent> {
    subject: Subjects.USER_DELETED = Subjects.USER_DELETED
    queueGroupName = "survey-service"

    async onMessage(data: UserDeletedEvent['data'], msg: Message) {
        const existingUser = await User.findOne({ _id: data.id })

        if(!existingUser) {
            throw new Error('User do not exists')
        }

        await User.deleteOne({ _id: data.id })

        msg.ack()
    }
}