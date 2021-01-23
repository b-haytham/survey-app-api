import { BadRequestError } from "@dabra/survey_common";
import { Router } from "express";
import jwt from 'jsonwebtoken'

import Organization from "../models/Organization";
import { Password } from "../utils/Password";

const router = Router()

router.post('/api/organizations/login', async (req, res, next)=> {
    console.log("Login");
    
    const { email, password } = req.body

    const existingOrganization = await Organization.findOne({ email })

    if (!existingOrganization) {
        throw new BadRequestError("Invalid credentials")
    }

    const passwordMatch = await Password.compare(existingOrganization.password, password)

    if(!passwordMatch) {
        throw new BadRequestError("Invalid credentials")
    }

    const token = jwt.sign({
        id: existingOrganization.id,
        email: existingOrganization.email
    },
        process.env.JWT_SECRET!
    )
    
    req.session = {
        jwt: token
    }

    res.status(200).send(existingOrganization)
})

export default router