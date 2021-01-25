import { BadRequestError, UserRoles } from "@dabra/survey_common";
import { Router } from "express";
import User from "../models/User";
import jwt from 'jsonwebtoken'
import { UserCreatedPublisher } from "../events/UserCreatedPublisher";
import { natsWrapper } from "../NatsWrapper";

const router = Router()

router.post('/api/users/register', async (req, res,next)=> {
    console.log("Register");

    const { name, email, password } = req.body
    const existingUser = await User.findOne({email})

    if(existingUser) {
        console.log("email in use");
        //throw new BadRequestError("E-mail exist")
        return next(new BadRequestError("E-mail exist"))
    }

    const user = User.build({email, password, name, isVerified: false, role: UserRoles.USER })

    await user.save()

    await new UserCreatedPublisher(natsWrapper.client).publish({
        //@ts-ignore
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        isVerified: user.isVerified,
        version: user.version
    })

    const token = jwt.sign(
        {
            id: user.id,
            email: user.email,
            role: user.role
        },
        process.env.JWT_SECRET!
    )

    req.session = {
        jwt: token
    }

    res.status(201).send(user)
})

export default router