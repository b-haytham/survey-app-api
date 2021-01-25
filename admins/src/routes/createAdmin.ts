import { BadRequestError, currentUserMiddleware, requireAuth, requireSuperAdmin, UserRoles } from "@dabra/survey_common";
import { Router } from "express";
import jwt from 'jsonwebtoken'
import { AdminCreatedPublisher } from "../events/AdminCreatedPublisher";

import Admin from "../models/Admin";
import { natsWrapper } from "../NatsWrapper";

const router = Router()

router.post('/api/admins/new', currentUserMiddleware,requireSuperAdmin , async (req, res, next)=> {
    const { name, email, password } = req.body

    const existingAdmin = await Admin.findOne({email})

    if(existingAdmin) {
        console.log('email in use')
        return next(new BadRequestError("E-mail exist"))
    }

    const admin = Admin.build({
        email,
        name,
        password,
        role: UserRoles.ADMIN,
        isVerified: false
    })

    await admin.save()

    new AdminCreatedPublisher(natsWrapper.client).publish({
        //@ts-ignore
        id: admin.id,
        email: admin.email,
        isVerified: admin.isVerified,
        name: admin.name,
        role: admin.role,
        version: admin.version
    })

    const token = jwt.sign(
        {
            id: admin.id,
            email: admin.email,
            role: admin.role
        },
        process.env.JWT_SECRET!
    )

    req.session = {
        jwt: token
    }

    res.status(201).send(admin)

})

export default router