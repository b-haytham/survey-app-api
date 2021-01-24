import { BadRequestError } from "@dabra/survey_common";
import { Router } from "express";
import jwt from 'jsonwebtoken'

import User from "../models/User";
import { Password } from "../utils/Password";

const router = Router()

router.post('/api/users/login', async (req, res, next)=> {
    console.log("Login");
    
    const { email, password } = req.body

    const existingUser = await User.findOne({ email })

    if (!existingUser) {
        return next(new BadRequestError("Invalid credentials"))
    }

    const passwordMatch = await Password.compare(existingUser.password, password)

    if(!passwordMatch) {
        return next(new BadRequestError("Invalid credentials"))
    }

    const token = jwt.sign({
        id: existingUser.id,
        email: existingUser.email,
        role: existingUser.role
    },
        process.env.JWT_SECRET!
    )
    
    req.session = {
        jwt: token
    }

    res.status(200).send(existingUser)
})

export default router