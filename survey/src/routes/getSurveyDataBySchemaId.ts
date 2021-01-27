import { currentUserMiddleware, NotAuthorizedError, NotFoundError, requireNotUser } from "@dabra/survey_common";
import { Router } from "express";
import SurveyData from "../models/SurveyData";
import SurveySchema from "../models/SurveySchema";


const router = Router()

router.get(
    '/api/survey/survey-data/:schemaId',
    currentUserMiddleware,
    requireNotUser, 
    async (req, res, next)=> {
        const existingSurveySchema = await SurveySchema.findById(req.params.schemaId)

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

        const surveyData = await SurveyData.find({ surveySchemaId: req.params.schemaId })

        res.status(200).send(surveyData)
 
    }
)

export default router