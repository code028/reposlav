import express from "express";
import { handleGetAllUniversitiesByOwner, handleGetAllUniversitiesByOwnerForServices, handleGetServiceFromUniFac, handleGetUniById, handleUniversityAdd } from "../controllers/university.controller";
import { UniversityAddValidation } from "../validations/university.validation";
import roleGuard from "../auth/roleGuard";

const router = express.Router({mergeParams: true});

router
    .post('/add', roleGuard({requiredRoles: ['admin']}), UniversityAddValidation, handleUniversityAdd)
    .get('/all', handleGetAllUniversitiesByOwner)
    .get('/all/service', handleGetAllUniversitiesByOwnerForServices)
    .get('/:id', handleGetUniById)
    .get('/:id/faculty/:id2/service/:id3', roleGuard({requiredRoles: ['admin']}), handleGetServiceFromUniFac)
    
export {router as universityRouter};