import express from "express";
import { handleGetAllUniversitiesByOwner, handleGetUniById, handleUniversityAdd } from "../controllers/university.controller";
import { UniversityAddValidation } from "../validations/university.validation";

const router = express.Router({mergeParams: true});

router
    .post('/add', UniversityAddValidation, handleUniversityAdd)
    .get('/all', handleGetAllUniversitiesByOwner)
    .get('/:id', handleGetUniById)

export {router as universityRouter};