import { Router } from "express";

const pingRouter = Router();

pingRouter.get("/", async (request, response) => {
    return response.json({ message: "pong - agora vai" });
});
export default pingRouter;
