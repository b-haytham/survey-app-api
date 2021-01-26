import { BadRequestError } from "@dabra/survey_common";
import { Router } from "express";
import { UserUpdatedPublisher } from "../events/UserUpdatedPublisher";
import User from "../models/User";
import { natsWrapper } from "../NatsWrapper";

const router = Router()

router.post('/api/admins/reset-password/:token', async (req, res, next) => {
    const existingUser = await User.findOne({ 
        resetPasswordToken: req.params.token, 
        resetPasswordExpires: {$gt: Date.now().toString()}
    })

    if(!existingUser) {
        return next(new BadRequestError('token is invalid'))
    }

    existingUser.password = req.body.password
    existingUser.resetPasswordToken = undefined
    existingUser.resetPasswordExpires = undefined

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

    res.status(200).send({})

}) 

export default router