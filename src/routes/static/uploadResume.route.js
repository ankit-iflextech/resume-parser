
import express from "express";
import { anylsisResume } from "../../controllers/uploadResume.controller.js";
import { uploadSingleFile } from "../../middlewares/uploadSingleFile.middleware.js";

const router = express.Router();

router.get('/',(req, res) =>{
    return res.render('upload');
})

router.post('/analyze-resume', uploadSingleFile, anylsisResume)


export default router