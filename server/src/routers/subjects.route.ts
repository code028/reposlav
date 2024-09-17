import express from "express";
import { handleGetDepsOnFacsWhereServiceHasUserWithId, handleGetSubjectById, handleSubjectAdd } from "../controllers/subject.controller";

const router = express.Router({mergeParams: true});

router
    .post('/add', handleSubjectAdd)
    .get('/:id', handleGetSubjectById)
    .get('/:id/universities', handleGetDepsOnFacsWhereServiceHasUserWithId)

export {router as subjectRouter};