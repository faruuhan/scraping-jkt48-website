import puppeteer from "puppeteer";

const news = {
  getAllNews: async (req, res) => {
    try {
      const browser = await puppeteer.launch({ headless: false });

      const page = await browser.newPage();

      await page.goto("https://jkt48.com/news/list?lang=id");

      const newsDataList = await page.evaluate(() => {
        const getNews = Array.from(
          document.querySelectorAll(".entry-news .entry-news__list")
        );

        const data = getNews.map((news) => ({
          title: news.querySelector("h3 a").innerText,
          time: news.querySelector("time").innerText,
        }));

        return data;
      });

      await browser.close();
      return res.status(200).json({ code: 200, result: newsDataList });
    } catch (error) {
      await browser.close();
      return res.status(500).json({ code: 500, messages: "Failed get data!" });
    }
  },
};

export default news;
