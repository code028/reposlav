import express, { Application } from "express";
import "dotenv/config";
import router from "./routes";
import cors from "cors";
import { MulterRouter } from "./multer/multer";

const PORT: number | undefined = parseInt(`${process.env.PORT}`);

if(!PORT) throw Error("PORT IS MISSING!")

const app = express();
app.use(express.json());
app.use(cors());
// Multer za upload
app.use('/', MulterRouter);

app.listen(PORT, () => {
    console.clear();
    console.log(`\tServer is running on port: ${PORT}`);
    console.log("\n\tPrisma Studio: http://localhost:5555")
});

router(app);