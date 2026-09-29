import { Router } from "express";
import { getTotalPublished } from "../events/listeners/count-published-posts.listener.js";

const router = Router();

router.get("/stats", (req, res) => {
  res.status(200).json({
    totalPublished: getTotalPublished(),
  });
});

export default router;