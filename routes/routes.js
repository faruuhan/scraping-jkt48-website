import express from "express";
const router = express();
import schedule from "../controllers/schedule.js";
import member from "../controllers/member.js";

router.get("/schedule", schedule.getSchedule);
router.get("/member", member.getAllMember);

export default router;
