
import express from "express";
import { findJobsAndListing } from "../../controllers/jobs.controller.js";

const router = express.Router();

router.get('/:id', findJobsAndListing)


export default router