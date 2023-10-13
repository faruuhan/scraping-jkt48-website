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
        const categoryFilter = (category: string): string => {
          switch (category.slice(8).split(".")[1]) {
            case "cat1":
              return "Theater";
            case "cat2":
              return "Event";
            case "cat4":
              return "Release";
            case "cat5":
              return "Birthday";
            case "cat8":
              return "Other";
            default:
              return "Unknown";
          }
        };

        const getID = (url: string): number => {
          return Number(url.slice(16).split("?")[0]);
        };

        const getNews: HTMLElement[] = Array.from(
          document.querySelectorAll(".entry-news .entry-news__list")
        );

        const data: NewsDataList[] = getNews.map((news: HTMLElement) => ({
          id: getID(news.querySelector("h3 a")?.getAttribute("href")!),
          title: (news.querySelector("h3 a") as HTMLHeadElement).innerText,
          date: (news.querySelector("time") as HTMLHeadElement).innerText,
          category: categoryFilter(
            news
              .querySelector(".entry-news__list--label img")
              ?.getAttribute("src")!
          ),
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
