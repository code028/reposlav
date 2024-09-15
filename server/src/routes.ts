import { Express, Request, Response } from "express";

// Controller functions
import { handleRegister } from "./controllers/user.controller";

// Validations
import { registerValidation } from "./validations/user.validation";

// Routers
import { sessionRouter } from "./routers/session.route";
import { universityRouter } from "./routers/university.route";
import { userRouter } from "./routers/user.route";
import authGuard from "./auth/authGuard";
import roleGuard from "./auth/roleGuard";

export default function (app: Express) {
    app.get("/status", (req: Request, res: Response) => {
        res.status(200).json({"status": 200,"message": "The server is operating normally"});
    });
    
    app.post("/register", registerValidation, handleRegister)

    app.use("/auth", sessionRouter);
    app.use("/user", authGuard, userRouter);
    
    app.use("/university", authGuard, roleGuard({requiredRoles: ['admin']}), universityRouter);

    // Page doesn`t exist
    app.get("*", (req: Request, res: Response) => {
        res.status(404).send({"status": 404, "message": "Page doesn`t exist"});
    });

    // Forbidden methods
    app.use("*", (req: Request, res: Response) => {
        const {originalUrl} = req;
        res.status(404).send({"status": 404, "message": req.method + " metod not allowed on "+ originalUrl});
    });
}