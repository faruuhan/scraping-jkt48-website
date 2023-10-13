import express, { Express, Response, Request } from "express";
import cors from "cors";
import router from "./routes/routes";
require("dotenv").config();

const app: Express = express();
const PORT: number = 8000;

app.use(cors());

app.listen(PORT, () => {
  console.log(`Server Running on port http://localhost:${PORT}`);
});

app.get("/", (req: Request, res: Response) => {
  res.send("scraping jkt48 web by faruuhan");
});

app.use("/api", router);
