import { currentUserMiddleware, NotAuthorizedError, NotFoundError, requireNotUser } from "@dabra/survey_common";
import { Router } from "express";

import SurveySchema from "../models/SurveySchema";

const router = Router()

router.get(
    '/api/survey/survey-schema/:id',
    currentUserMiddleware,
    requireNotUser, 
    async (req, res, next)=> {
        const surveySchemaToGetId = req.params.id

        const existingSurveySchema = await SurveySchema.findById(surveySchemaToGetId)

        if(!existingSurveySchema) {
            return next(new NotFoundError())
        }

        if(existingSurveySchema.creator.type === 'ORGANIZATION') {
            console.log('match ', req.currentUser?.id === existingSurveySchema.creator.orgId?.toString())
            if(existingSurveySchema.creator.orgId?.toString() !== req.currentUser?.id) {
                return next(new NotAuthorizedError())
            }
        } else {
            console.log('match ', req.currentUser?.id === existingSurveySchema.creator.adminId?.toString())
            if(existingSurveySchema.creator.adminId?.toString() !== req.currentUser?.id) {
                return next(new NotAuthorizedError())
            }
        }

        res.status(200).send(existingSurveySchema)

    }
)

export default router