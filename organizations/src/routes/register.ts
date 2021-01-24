import {
  BadRequestError,
  currentUserMiddleware,
  UserRoles,
} from "@dabra/survey_common";
import { Router } from "express";
import Organization from "../models/Organization";
import jwt from "jsonwebtoken";

const router = Router();

router.post(
  "/api/organizations/register",
  currentUserMiddleware,
  async (req, res, next) => {
    console.log("Register");

    const { name, email, password } = req.body;
    const existingOrganization = await Organization.findOne({ email });

    if (existingOrganization) {
      console.log("email in use");
      throw new BadRequestError("E-mail exist");
    }

    const organization = Organization.build({
      email,
      password,
      name,
      isVerified: false,
      role: req.currentUser?.role === UserRoles.ORGANIZATION_ADMIN ? UserRoles.ORGANIZATION_USER : UserRoles.ORGANIZATION_ADMIN,
    });

    await organization.save();

    const token = jwt.sign(
      {
        id: organization.id,
        email: organization.email,
        role: organization.role,
      },
      process.env.JWT_SECRET!
    );

    req.session = {
      jwt: token,
    };

    res.status(201).send(organization);
  }
);

export default router;
