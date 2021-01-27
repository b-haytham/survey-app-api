import { currentUserMiddleware, NotAuthorizedError, NotFoundError, requireNotUser, UserRoles } from "@dabra/survey_common";
import { Router } from "express";
import { SurveySchemaUpdatedPublisher } from "../events/publishers/SurveySchemaUpdatedPublisher";
import SurveySchema from "../models/SurveySchema";
import { natsWrapper } from "../NatsWrapper";

const router = Router()

router.post(
    '/api/survey/survey-schema/update/:id',
    currentUserMiddleware,
    requireNotUser,
    async (req, res, next)=> {

        const surveySchemaToUpdateId = req.params.id 
 
        const existingSurveySchema = await SurveySchema.findOne({_id: surveySchemaToUpdateId})
        
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
         

        const { title, description, isDraft, questions, answers } = req.body


        
        const loggedInUserRole = req.currentUser?.role

        

        existingSurveySchema.set({
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

        await existingSurveySchema.save()

        await new SurveySchemaUpdatedPublisher(natsWrapper.client).publish({
            //@ts-ignore
            id: existingSurveySchema.id,
            description: existingSurveySchema.description,
            title: existingSurveySchema.title,
            version: existingSurveySchema.version,
            creator: {
                type: existingSurveySchema.creator.type,
                //@ts-ignore
                id: existingSurveySchema.creator.type === 'ORGANIZATION' ? 
                    existingSurveySchema.creator.orgId : existingSurveySchema.creator.adminId
            }
        })

        res.status(200).send(existingSurveySchema)
    }
)

export default router