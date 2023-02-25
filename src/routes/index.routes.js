import { Router } from "express"

const router = Router()

router.get("/", (req, res) => {
    res.json(
        {
            "message": "Intranet Service"
        }
    );
});

export default router;