import express from "express";
import { handleGetAllUniversitiesByOwner, handleUniversityAdd } from "../controllers/university.controller";
import { UniversityAddValidation } from "../validations/university.validation";

const router = express.Router({mergeParams: true});

router
    .post('/add', UniversityAddValidation, handleUniversityAdd)
    .get('/all', handleGetAllUniversitiesByOwner)

export {router as universityRouter};