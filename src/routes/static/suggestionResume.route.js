
import express from "express";
import { suggestionPage } from "../../controllers/suggestionPage.controller.js";


const router = express.Router();

router.get('/:id', suggestionPage)


export default router