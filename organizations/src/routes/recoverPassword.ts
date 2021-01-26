import { Router } from "express";
import { OrganizationForgotPasswordPublisher } from "../events/OrganizationForgotPasswordPublisher";
import { OrganizationUpdatedPublisher } from "../events/OrganizationUpdatedPublisher";
import Organization, { generatePasswordReset } from "../models/Organization";
import { natsWrapper } from "../NatsWrapper";

const router = Router()

router.post('/api/organizations/recover', async (req, res, next) => {
    const { email } = req.body
    const existingOrg = await Organization.findOne({ email })

    if(!existingOrg) {
        return res.status(200).send({})
    }

    
    const { resetPasswordExpires, resetPasswordToken } = generatePasswordReset()

    existingOrg.set({
        resetPasswordToken,
        resetPasswordExpires
    })

    await existingOrg.save()

    await new OrganizationUpdatedPublisher(natsWrapper.client).publish({
        //@ts-ignore
        id: existingOrg.id,
        email: existingOrg.email,
        isVerified: existingOrg.isVerified,
        name: existingOrg.name,
        role: existingOrg.role,
        version: existingOrg.version
    })

    await new OrganizationForgotPasswordPublisher(natsWrapper.client).publish({
        email: existingOrg.email,
        id: existingOrg.id!,
        isVerified: existingOrg.isVerified,
        role: existingOrg.role,
        version: existingOrg.version,
        //@ts-ignore
        endPoint: `${req.headers.host}/api/organizations/reset/${existingOrg.resetPasswordToken}`
    })

    res.status(200).send({})
})

export default router
