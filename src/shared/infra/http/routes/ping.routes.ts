import { Router } from "express";

const pingRouter = Router();

pingRouter.get("/", async (request, response) => {
    return response.json({ message: "pong - Hiiii Lorenaaaaa" });
});
export default pingRouter;
