import express from "express";
const router = express();
import schedule from "../controllers/schedule.js";
import member from "../controllers/member.js";

router.get("/schedule", schedule.getSchedule);
router.get("/schedule/detail/:idschedule", schedule.getDetailSchedule);
router.get("/member", member.getAllMember);
router.get("/member/detail/:idmember", member.getDetailMember);

export default router;
