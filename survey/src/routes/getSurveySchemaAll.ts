import mongoose from 'mongoose'
import { currentUserMiddleware, NotAuthorizedError, NotFoundError, requireNotUser, UserRoles } from "@dabra/survey_common";
import { Router } from "express";

import SurveySchema from "../models/SurveySchema";

const router = Router()

router.get(
    '/api/survey/survey-schema',
    currentUserMiddleware,
    requireNotUser, 
    async (req, res, next)=> {
        const loggedInUserId = req.currentUser?.id  

        let allExistingSurveySchema

        if(req.currentUser?.role === UserRoles.ORGANIZATION_ADMIN || req.currentUser?.role === UserRoles.ORGANIZATION_USER) {
            allExistingSurveySchema = await SurveySchema.find({'creator.orgId': loggedInUserId})
        }else {
            allExistingSurveySchema = await SurveySchema.find({ 'creator.adminId': loggedInUserId})
        }


        res.status(200).send(allExistingSurveySchema)

    }
)

export default router