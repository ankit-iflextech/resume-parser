
import express from "express";

const router = express.Router();

router.get('/', (req, res) =>{
    return res.render('sector');
})


export default router