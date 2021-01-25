import { currentUserMiddleware, QuestionTypesEnum, requireNotUser, UserRoles } from "@dabra/survey_common";
import { Router } from "express";
import { SurveySchemaCreatedPublisher } from "../events/publishers/SurveySchemaCreatedPublisher";
import SurveySchema, { SchemaType } from "../models/SurveySchema";
import { natsWrapper } from "../NatsWrapper";

const router = Router()

router.post(
    '/api/survey/survey-schema/create',
    currentUserMiddleware,
    requireNotUser,
    async (req, res, next)=> {

        const { title, description, isDraft, questions, answers } = req.body



        const loggedInUserRole = req.currentUser?.role

        

        const surveySchema = SurveySchema.build({
            title,
            description,
            isDraft,
            creator: {
                orgId: (loggedInUserRole === UserRoles.ORGANIZATION_ADMIN || loggedInUserRole === UserRoles.ORGANIZATION_USER) ?
                        req.currentUser?.id : undefined ,
                adminId: (loggedInUserRole === UserRoles.SUPER_ADMIN || loggedInUserRole === UserRoles.ADMIN) ? 
                        req.currentUser?.id : undefined ,
                type: 
                    (loggedInUserRole === UserRoles.ORGANIZATION_ADMIN || loggedInUserRole === UserRoles.ORGANIZATION_USER) ?
                    'ORGANIZATION' : 'ADMIN',
            },
            questions,
            answers
        })

        await surveySchema.save()

        await new SurveySchemaCreatedPublisher(natsWrapper.client).publish({
            //@ts-ignore
            id: surveySchema.id,
            description: surveySchema.description,
            title: surveySchema.title,
            version: surveySchema.version,
            creator: {
                type: surveySchema.creator.type,
                //@ts-ignore
                id: surveySchema.creator.type === 'ORGANIZATION' ? 
                    surveySchema.creator.orgId : surveySchema.creator.adminId
            }
        })

        res.status(200).send(surveySchema)
    }
)

export default router