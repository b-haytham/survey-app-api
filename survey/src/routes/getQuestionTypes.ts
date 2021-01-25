import { currentUserMiddleware, NotAuthorizedError, requireAuth, UserRoles } from "@dabra/survey_common";
import { Router } from "express";
import QuestionType from "../models/QuestionTypes";

const router = Router()

router.get(
    '/api/survey/questions', 
    currentUserMiddleware ,
    requireAuth, 
    async (req, res, next) => {
        if(req.currentUser?.role === UserRoles.USER) {
            return next(new NotAuthorizedError())
        }          

        const questions = await QuestionType.find({})

        res.status(200).send(questions)
})

export default router