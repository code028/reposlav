import express from "express";
import { handleAddUserToService, handleGetServiceById, handleGetServicesByUniversityOwner, handleGetUnisByServiceWhereUserId, handleServiceAdd } from "../controllers/service.controller";
import roleGuard from "../auth/roleGuard";

const router = express.Router({mergeParams: true});

router
    .post('/add', handleServiceAdd)
    .get('/:id/unis', handleGetUnisByServiceWhereUserId)
    .get('/all', handleGetServicesByUniversityOwner)
    .post('/user/add', roleGuard({requiredRoles: ['admin']}), handleAddUserToService)
    .get('/:id', handleGetServiceById)

export {router as serviceRouter};