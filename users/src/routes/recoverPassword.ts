import { Router } from "express";
import { UserForgotPasswordPublisher } from "../events/UserForgotPasswordEvent";
import { UserUpdatedPublisher } from "../events/UserUpdatedPublisher";
import User, { generatePasswordReset } from "../models/User";
import { natsWrapper } from "../NatsWrapper";

const router = Router()

router.post('/api/users/recover', async (req, res, next) => {
    const { email } = req.body
    const existingUser = await User.findOne({ email })

    if(!existingUser) {
        return res.status(200).send({})
    }

    const { resetPasswordExpires, resetPasswordToken } = generatePasswordReset()

    existingUser.set({
        resetPasswordExpires,
        resetPasswordToken
    })

    await existingUser.save()

    await new UserUpdatedPublisher(natsWrapper.client).publish({
        //@ts-ignore
        id: existingUser.id,
        email: existingUser.email,
        isVerified: existingUser.isVerified,
        name: existingUser.name,
        role: existingUser.role,
        version: existingUser.version
    })

    await new UserForgotPasswordPublisher(natsWrapper.client).publish({
        email: existingUser.email,
        id: existingUser.id!,
        isVerified: existingUser.isVerified,
        role: existingUser.role,
        version: existingUser.version,
        endPoint: `${req.headers.host}/api/admins/reset/${existingUser.resetPasswordToken}`
    })

    res.status(200).send({})
})

export default router
