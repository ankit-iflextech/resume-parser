import express from "express";
import homeRoutes from './home.route.js';
import sectorRoutes from './sectorResume.route.js';
import jobRoutes from './jobsResume.route.js';
import suggestionRoutes from './suggestionResume.route.js';
import uploadRoutes from './uploadResume.route.js';

const router = express.Router();

router.use('/', homeRoutes);
router.use('/upload', uploadRoutes);
router.use('/sector', sectorRoutes);
router.use('/suggestion', suggestionRoutes);
router.use('/job', jobRoutes);


export default router;