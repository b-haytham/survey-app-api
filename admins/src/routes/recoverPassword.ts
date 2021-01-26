import { Router } from "express";
import { AdminForgotPasswordPublisher } from "../events/AdminForgotPasswordPublisher";
import { AdminUpdatedPublisher } from "../events/AdminUpdatedPublisher";
import Admin from "../models/Admin";
import { natsWrapper } from "../NatsWrapper";

const router = Router()

router.post('/api/admins/recover', async (req, res, next) => {
    const { email } = req.body
    const existingAdmin = await Admin.findOne({ email })

    if(!existingAdmin) {
        return res.status(200).send({})
    }

    existingAdmin.generatePasswordReset()

    await existingAdmin.save()

    await new AdminUpdatedPublisher(natsWrapper.client).publish({
        //@ts-ignore
        id: existingAdmin.id,
        email: existingAdmin.email,
        isVerified: existingAdmin.isVerified,
        name: existingAdmin.name,
        role: existingAdmin.role,
        version: existingAdmin.version
    })

    await new AdminForgotPasswordPublisher(natsWrapper.client).publish({
        email: existingAdmin.email,
        id: existingAdmin.id!,
        isVerified: existingAdmin.isVerified,
        role: existingAdmin.role,
        version: existingAdmin.version,
        endPoint: `${req.headers.host}/api/admins/reset/${existingAdmin.resetPasswordToken}`
    })

    res.status(200).send({})
})

export default router
