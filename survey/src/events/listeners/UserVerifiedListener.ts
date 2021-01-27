
import { AdminVerifiedEvent, Listener, Subjects, UsererifiedEvent } from "@dabra/survey_common";
import { Message } from "node-nats-streaming";

import Admin from "../../models/Admin";
import User from "../../models/User";

export class UserVerifiedListener extends Listener<UsererifiedEvent>  {
    subject: Subjects.USER_VERIFIED = Subjects.USER_VERIFIED
    queueGroupName = "survey-service"

    async onMessage(data: UsererifiedEvent['data'], msg: Message) {
        const existingUser = await User.findOne({ _id: data.id, version: data.version - 1 })

        if(!existingUser) {
            throw new Error('User do not exists')
        }

        existingUser.isVerified = true
                
        await existingUser.save()

        msg.ack()
    }
}