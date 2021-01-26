import { BadRequestError, UserRoles } from "@dabra/survey_common";
import { Router } from "express";
import { AdminUpdatedPublisher } from "../events/AdminUpdatedPublisher";
import Admin from "../models/Admin";
import { natsWrapper } from "../NatsWrapper";

const router = Router()

router.post('/api/admins/reset-password/:token', async (req, res, next) => {
    const existingAdmin = await Admin.findOne({ 
        resetPasswordToken: req.params.token, 
        resetPasswordExpires: {$gt: Date.now().toString()}
    })

    if(!existingAdmin) {
        return next(new BadRequestError('token is invalid'))
    }

    existingAdmin.password = req.body.password
    existingAdmin.resetPasswordToken = undefined
    existingAdmin.resetPasswordExpires = undefined

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

    res.status(200).send({})

}) 