import { BadRequestError } from "@dabra/survey_common";
import { Router } from "express";
import { OrganizationUpdatedPublisher } from "../events/OrganizationUpdatedPublisher";
import Organization from "../models/Organization";
import { natsWrapper } from "../NatsWrapper";

const router = Router()

router.post('/api/organizations/reset-password/:token', async (req, res, next) => {
    const existingOrg = await Organization.findOne({ 
        resetPasswordToken: req.params.token, 
        //@ts-ignore
        resetPasswordExpires: { $gt: Date.now() }
    })

    if(!existingOrg) {
        return next(new BadRequestError('token is invalid'))
    }

    existingOrg.password = req.body.password
    //@ts-ignore
    existingOrg.resetPasswordToken = undefined
    //@ts-ignore
    existingOrg.resetPasswordExpires = undefined

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

    res.status(200).send({})

}) 

export default router