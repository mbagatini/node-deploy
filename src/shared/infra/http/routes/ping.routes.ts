import { Router } from "express";

const pingRouter = Router();

pingRouter.get("/", async (request, response) => {
    return response.json({ message: "pong - oi Tiny class" });
});
export default pingRouter;
