import { Router } from "express";
import { currentUserMiddleware } from '@dabra/survey_common'

const router = Router()

router.get('/api/organizations/current-user', currentUserMiddleware ,(req, res, next) => {
    res.send({
        currentUser: req.currentUser || null
    })
})

export default router