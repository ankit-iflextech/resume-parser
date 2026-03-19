
import express from "express";

const router = express.Router();

router.get('/', (req, res) =>{
    return res.render('suggestion');
})


export default router