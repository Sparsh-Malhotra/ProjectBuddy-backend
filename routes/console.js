import express from "express";
import { getHome } from "../controllers/console";

const router = express.Router();

router.get("/home", getHome);

export default router;
