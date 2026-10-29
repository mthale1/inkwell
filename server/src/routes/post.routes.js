// server/src/routes/post.routes.js
//
// Wires PostService's publish() and listPublished() to
// the API contract's POST /api/posts and GET /api/posts (Lecture 4).
// Same thin-route discipline as auth.routes.js: no business rules here.

import { Router } from "express";
import { PostService } from "../services/post.service.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/posts", requireAuth, async (req, res, next) => {
    try {
        // Never trust client-supplied identity fields — derive
        // authorId from the authenticated request, not the request body.
        const post = await PostService.publish({
            ...req.body,
            authorId: req.user.id, // set by requireAuth middleware from the verified JWT
        });
        res.status(201).json(post);
    } catch (err) {
        next(err);
    }
});

router.get("/posts", async (req, res, next) => {
    try {
        const { page = 1, pageSize = 10, search } = req.query;
        const parsedPageSize = Number(pageSize);

        if (
            !Number.isInteger(parsedPageSize) ||
            parsedPageSize < 1 ||
            parsedPageSize > 50
        ) {
            return res.status(400).json({
                error: {
                    code: "INVALID_PAGE_SIZE",
                    message: "pageSize must be an integer between 1 and 50.",
                },
            });
        }

        const result = search
            ? await PostService.search({
                query: search,
                page: Number(page),
                pageSize: parsedPageSize,
            })
            : await PostService.listPublished({
                page: Number(page),
                pageSize: parsedPageSize,
            });

        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
});

export default router;