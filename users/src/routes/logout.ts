import { Router } from "express";

const router = Router()

router.post('/api/users/logout', (req, res, next)=> {
    req.session = null
    res.status(200).send({})
})

export default router