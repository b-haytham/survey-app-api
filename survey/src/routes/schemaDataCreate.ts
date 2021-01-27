import { BadRequestError, currentUserMiddleware, requireAuth, requireUser } from "@dabra/survey_common";
import { Router } from "express";
import { SurveyDataCreatedPublisher } from "../events/publishers/SurveyDataCreatedPublisher";
import SurveyData from "../models/SurveyData";
import { natsWrapper } from "../NatsWrapper";

const router = Router()

router.post(
    '/api/survey/survey-data',
    currentUserMiddleware,
    requireUser,
    async (req, res, next)=> {
        const { surveySchemaId, data } = req.body
        const existingSurveyData = await SurveyData.findOne({userId: req.currentUser?.id, surveySchemaId })

        if(existingSurveyData) {
            return next(new BadRequestError('User Already Took Survey'))
        }

        const surveyData = SurveyData.build({
            userId: req.currentUser!.id,
            surveySchemaId,
            data
        })

        await surveyData.save()

        await new SurveyDataCreatedPublisher(natsWrapper.client).publish({
            id: surveyData.id!,
            userId: surveyData.userId,
            surveySchemaId: surveyData.surveySchemaId,
            version: surveyData.version
        })

        res.status(201).send(surveyData)
    }
)

export default router