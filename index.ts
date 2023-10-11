import express from "express";
import cors from "cors";
import router from "./routes/routes";

const app = express();
const PORT = 8000;

app.use(cors());

app.listen(PORT, () => {
  console.log(`Server Running on port http://localhost:${PORT}`);
});

app.get("/", (req, res) => {
  res.send("scraping jkt48 web by faruuhan");
});

app.use("/api", router);
