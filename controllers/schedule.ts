import puppeteer, { Browser, Page } from "puppeteer";
import { Request, Response } from "express";
import { ScheduleListDetail, ScheduleList, ScheduleData } from "../utils/types";
const schedule = {
  getSchedule: async (req: Request, res: Response) => {
    const browser: Browser = await puppeteer.launch({ headless: false });

    const page: Page = await browser.newPage();

    try {
      await page.goto(`${process.env.URL_SCRAP}/calendar/list?lang=id`);

      const scheduleData: ScheduleData = await page.evaluate(() => {
        const dateConvert = (date: string): string => {
          return date.replace("\n", " ");
        };

        const categoryFilter = (category: string): string => {
          switch (category.slice(8).split(".")[1]) {
            case "cat2":
              return "Event";
            case "cat17":
              return "Show Theater";
            case "cat19":
              return "Show Trainee";
            default:
              return "Unknown";
          }
        };

        const generateID = (url: string): number => {
          return url.includes("theater")
            ? Number(url.slice(22).split("?")[0])
            : Number(
                url.slice(17, 30).split("/")[0] +
                  url.slice(17, 30).split("/")[2] +
                  url.slice(17, 30).split("/")[4]
              );
        };

        const scheduleList: HTMLElement[] = Array.from(
          document.querySelectorAll(".entry-schedule__calendar .table tbody tr")
        );

        const data: ScheduleList[] = scheduleList.map(
          (schedule: HTMLElement) => ({
            date: dateConvert(
              (schedule.querySelector("td h3") as HTMLHeadElement).innerText
            ),
            event: Array.from(schedule.querySelectorAll("td .contents"))?.map(
              (event) => ({
                id: generateID(
                  event.querySelector("p a")!.getAttribute("href")!
                ),
                title: (event.querySelector("p a") as HTMLHeadElement)
                  ?.innerText,
                category: categoryFilter(
                  event.querySelector("span img")!.getAttribute("src")!
                ),
              })
            ),
          })
        );

        const result: ScheduleData = {
          period: (
            document.querySelector(
              ".entry-schedule__header .entry-schedule__header--center"
            ) as HTMLHeadElement
          ).innerText,
          listSchedule: data,
        };

        return result;
      });

      await browser.close();

      return res.status(200).json({ code: 200, result: scheduleData });
    } catch (error) {
      await browser.close();
      console.log(error);
      return res.status(500).json({ code: 500, messages: "Failed get data!" });
    }
  },

  getDetailSchedule: async (req: Request, res: Response) => {
    const { idschedule } = req.params;

    const browser: Browser = await puppeteer.launch({ headless: false });

    const page: Page = await browser.newPage();

    try {
      await page.goto(
        `${process.env.URL_SCRAP}/theater/schedule/id/${idschedule}?lang=id`
      );

      const scheduleDetailData: ScheduleListDetail[] = await page.evaluate(
        () => {
          const dateConvert = (date: string): string => {
            return date.replace("\n", " ");
          };

          const titleConvert = (title: string): string => {
            return title.replaceAll("\n", " ");
          };

          const scheduleList: ScheduleListDetail[] = [];

          const getTable: NodeList = document.querySelectorAll(
            ".table-pink__scroll table"
          );

          const getRowTable: HTMLElement[] = Array.from(
            (getTable[1] as HTMLElement).querySelectorAll("tbody tr")
          );

          getRowTable.map((schedule: HTMLElement) => {
            const listMember: string[] = [];
            const seitansai: string[] = [];
            schedule.querySelectorAll("td a").forEach((member: Element) => {
              if (!member.getAttribute("style")) {
                listMember.push((member as HTMLHeadElement).innerText);
              } else {
                seitansai.push((member as HTMLHeadElement).innerText);
              }
            });

            scheduleList.push({
              show: dateConvert(
                (schedule.querySelectorAll("td")[0] as HTMLHeadElement)
                  .innerText
              ),
              setlist: titleConvert(
                (schedule.querySelectorAll("td")[1] as HTMLHeadElement)
                  .innerText
              ),
              member: listMember,
              seitansai,
            });
          });

          return scheduleList;
        }
      );

      await browser.close();
      return res.status(200).json({ code: 200, result: scheduleDetailData });
    } catch (error) {
      return res.status(500).json({ code: 500, messages: "Failed get data!" });
    }
  },

  getTheaterSchedule: async (req: Request, res: Response) => {
    const browser: Browser = await puppeteer.launch({ headless: false });

    const page: Page = await browser.newPage();

    try {
      await page.goto(`${process.env.URL_SCRAP}/theater/schedule?lang=id`);

      const scheduleDetailData: ScheduleListDetail[] = await page.evaluate(
        () => {
          const dateConvert = (date: string): string => {
            return date.replace("\n", " ");
          };

          const titleConvert = (title: string): string => {
            return title.replaceAll("\n", " ");
          };

          const scheduleList: ScheduleListDetail[] = [];

          const getTable: NodeList = document.querySelectorAll(
            ".table-pink__scroll table"
          );

          const getRowTable = Array.from(
            (getTable[1] as HTMLElement).querySelectorAll("tbody tr")
          );

          getRowTable.map((schedule: Element) => {
            const listMember: string[] = [];
            const seitansai: string[] = [];
            schedule.querySelectorAll("td a").forEach((member: Element) => {
              if (!member.getAttribute("style")) {
                listMember.push((member as HTMLHeadElement).innerText);
              } else {
                seitansai.push((member as HTMLHeadElement).innerText);
              }
            });

            scheduleList.push({
              show: dateConvert(schedule.querySelectorAll("td")[0].innerText),
              setlist: titleConvert(
                schedule.querySelectorAll("td")[1].innerText
              ),
              member: listMember,
              seitansai,
            });
          });

          return scheduleList;
        }
      );

      await browser.close();
      return res.status(200).json({ code: 200, result: scheduleDetailData });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ code: 500, messages: "Failed get data!" });
    }
  },
};

export default schedule;
