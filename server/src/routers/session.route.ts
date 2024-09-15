import express from "express";

// Controllers
import { 
	handleLogin, 
	handleLogout, 
	handleRefresh
} from "../controllers/user.controller";

// Validations
import { 
	loginValidation,
	refreshValidation,
	logoutValidation
} from "../validations/user.validation";

const router = express.Router({mergeParams: true});

router
	.post('/login', loginValidation, handleLogin)
	.post('/refresh', refreshValidation, handleRefresh)
	.post('/logout', logoutValidation, handleLogout)

export {router as sessionRouter};