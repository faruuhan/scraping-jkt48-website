import puppeteer, { Browser, Page } from "puppeteer";
import { Request, Response } from "express";
import { NewsDataList } from "../utils/types";

const news = {
  getAllNews: async (req: Request, res: Response) => {
    const browser: Browser = await puppeteer.launch({ headless: false });

    const page: Page = await browser.newPage();

    try {
      await page.goto(`${process.env.URL_SCRAP}/news/list?lang=id`);

      const newsDataList: NewsDataList[] = await page.evaluate(() => {
        const getNews: HTMLElement[] = Array.from(
          document.querySelectorAll(".entry-news .entry-news__list")
        );

        const data: NewsDataList[] = getNews.map((news: HTMLElement) => ({
          title: (news.querySelector("h3 a") as HTMLHeadElement).innerText,
          time: (news.querySelector("time") as HTMLHeadElement).innerText,
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
