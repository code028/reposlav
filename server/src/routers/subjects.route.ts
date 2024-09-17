import express from "express";
import { handleGetSubjectById, handleSubjectAdd } from "../controllers/subject.controller";

const router = express.Router({mergeParams: true});

router
    .post('/add', handleSubjectAdd)
    .get('/:id', handleGetSubjectById)

export {router as subjectRouter};