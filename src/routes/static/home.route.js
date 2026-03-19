
import express from "express";
import  {uploadSingleFile}  from "../../middlewares/uploadSingleFile.middleware.js";
import { uploadResume } from "../../controllers/uploadResume.controller.js";


const router = express.Router();

router.get('/', (req, res) =>{
    return res.render('home');
})

router.post('/upload', uploadSingleFile, uploadResume)


export default router