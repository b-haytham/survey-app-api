import { BadRequestError } from "@dabra/survey_common";
import { Router } from "express";
import jwt from 'jsonwebtoken'

import Admin from "../models/Admin";
import { Password } from "../utils/Password";

const router = Router()

router.post('/api/admins/login', async (req, res, next)=> {
    console.log("Login");
    
    const { email, password } = req.body

    const existingAdmin = await Admin.findOne({ email })

    if (!existingAdmin) {
        return next(new BadRequestError("Invalid credentials"))
    }

    const passwordMatch = await Password.compare(existingAdmin.password, password)

    if(!passwordMatch) {
        return next(new BadRequestError("Invalid credentials"))
    }

    const token = jwt.sign({
        id: existingAdmin.id,
        email: existingAdmin.email,
        role: existingAdmin.role
    },
        process.env.JWT_SECRET!
    )
    
    req.session = {
        jwt: token
    }

    res.status(200).send(existingAdmin)
})

export default router