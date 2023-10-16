import puppeteer, { Browser, Page } from "puppeteer";
import { Request, Response } from "express";
import { BirthdayDataList } from "../utils/types";

const birthday = {
  listBirthDay: async (req: Request, res: Response) => {
    const browser: Browser = await puppeteer.launch({ headless: false });

    const page: Page = await browser.newPage();
    try {
      await page.goto(`${process.env.URL_SCRAP}`);

      const birthDayList: BirthdayDataList[] = await page.evaluate(() => {
        const factoryData = (
          data: string,
          payload: string
        ): string | undefined => {
          switch (payload) {
            case "GET_NAME":
              return data.split("\n")[1];
            case "GET_DATE":
              return data.split("\n")[2];
            case "GET_STATUS":
              return data
                .split("\n")[0]
                .replaceAll("[", "")
                .replaceAll("]", "");
          }
        };

        const getListBirthDay: HTMLElement[] = Array.from(
          document.querySelectorAll(
            ".entry-home__schedule--birthday .entry-home__schedule--birthday__item"
          )
        );

        const data: BirthdayDataList[] = getListBirthDay.map(
          (listBirthDay: HTMLElement) => ({
            date: factoryData(
              (listBirthDay.querySelector("p") as HTMLHeadElement).innerText,
              "GET_DATE"
            ),
            name: factoryData(
              (listBirthDay.querySelector("p") as HTMLHeadElement).innerText,
              "GET_NAME"
            ),
            statusMember: factoryData(
              (listBirthDay.querySelector("p") as HTMLHeadElement).innerText,
              "GET_STATUS"
            ),
          })
        );

        return data;
      });

      await browser.close();

      return res.status(200).json({ code: 200, result: birthDayList });
    } catch (error) {
      await browser.close();
      return res.status(500).json({ code: 500, messages: "Failed get data!" });
    }
  },
};

export default birthday;
