import express from "express";
const router = express();
import schedule from "../controllers/schedule.js";
import member from "../controllers/member.js";
import news from "../controllers/news.js";

router.get("/schedule", schedule.getSchedule);
router.get("/schedule/detail/:idschedule", schedule.getDetailSchedule);
router.get("/member", member.getAllMember);
router.get("/member/detail/:idmember", member.getDetailMember);
router.get("/news", news.getAllNews);

export default router;
