import express from "express";
import { handleGetUnisByServiceWhereUserId } from "../controllers/service.controller";

const router = express.Router({mergeParams: true});

router
    // .post('/add', handleServiceAdd)
    .get('/:id/unis', handleGetUnisByServiceWhereUserId)

export {router as serviceRouter};