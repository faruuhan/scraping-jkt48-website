import puppeteer from "puppeteer";
import { Request, Response } from "express";
import { ScheduleListDetail } from "../utils/types";

const schedule = {
  getSchedule: async (req: Request, res: Response) => {
    const browser = await puppeteer.launch({ headless: false });

    const page = await browser.newPage();

    try {
      await page.goto("https://jkt48.com/calendar/list?lang=id");

      const scheduleData = await page.evaluate(() => {
        const dateConvert = (date: string) => {
          return date.replace("\n", " ");
        };

        const categoryFilter = (category: string) => {
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

        const scheduleList: Element[] = Array.from(
          document.querySelectorAll(".entry-schedule__calendar .table tbody tr")
        );

        const data = scheduleList.map((schedule) => ({
          date: dateConvert(
            (schedule.querySelector("td h3") as HTMLHeadElement).innerText
          ),
          event: Array.from(schedule.querySelectorAll("td .contents"))?.map(
            (event) => ({
              title: (event.querySelector("p a") as HTMLHeadElement)?.innerText,
              category: categoryFilter(
                event.querySelector("span img")!.getAttribute("src")!
              ),
            })
          ),
        }));

        const result = {
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
      return res.status(500).json({ code: 500, messages: "Failed get data!" });
    }
  },

  getDetailSchedule: async (req: Request, res: Response) => {
    const { idschedule } = req.params;

    const browser = await puppeteer.launch({ headless: false });

    const page = await browser.newPage();

    try {
      await page.goto(
        `https://jkt48.com/theater/schedule/id/${idschedule}?lang=id`
      );

      const scheduleDetailData = await page.evaluate(() => {
        const titleConvert = (title: string) => {
          return title.replaceAll("\n", "");
        };

        const dateConvert = (date: string) => {
          return date.replaceAll("\n", " ");
        };

        const scheduleList: ScheduleListDetail[] = [];

        const getTable = document.querySelectorAll(".table-pink__scroll table");

        const getRowTable = Array.from(
          getTable[1].querySelectorAll("tbody tr")
        );

        getRowTable.map((schedule) => {
          const listMember: string[] = [];
          const seitansai: string[] = [];
          schedule.querySelectorAll("td a").forEach((member) => {
            if (!member.getAttribute("style")) {
              listMember.push((member as HTMLHeadElement).innerText);
            } else {
              seitansai.push((member as HTMLHeadElement).innerText);
            }
          });

          scheduleList.push({
            show: dateConvert(
              (schedule.querySelectorAll("td")[0] as HTMLHeadElement).innerText
            ),
            setlist: titleConvert(
              (schedule.querySelectorAll("td")[1] as HTMLHeadElement).innerText
            ),
            member: listMember,
            seitansai,
          });
        });

        return scheduleList;
      });

      await browser.close();
      return res.status(200).json({ code: 200, result: scheduleDetailData });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ code: 500, messages: "Failed get data!" });
    }
  },

  getTheaterSchedule: async (req: Request, res: Response) => {
    const browser = await puppeteer.launch({ headless: false });

    const page = await browser.newPage();

    try {
      await page.goto(`https://jkt48.com/theater/schedule?lang=id`);

      const scheduleDetailData = await page.evaluate(() => {
        const titleConvert = (title: string) => {
          return title.replaceAll("\n", "");
        };

        const dateConvert = (date: string) => {
          return date.replaceAll("\n", " ");
        };

        const scheduleList: ScheduleListDetail[] = [];

        const getTable = document.querySelectorAll(".table-pink__scroll table");

        const getRowTable = Array.from(
          getTable[1].querySelectorAll("tbody tr")
        );

        getRowTable.map((schedule) => {
          const listMember: string[] = [];
          const seitansai: string[] = [];
          schedule.querySelectorAll("td a").forEach((member) => {
            if (!member.getAttribute("style")) {
              listMember.push((member as HTMLHeadElement).innerText);
            } else {
              seitansai.push((member as HTMLHeadElement).innerText);
            }
          });

          scheduleList.push({
            show: dateConvert(schedule.querySelectorAll("td")[0].innerText),
            setlist: titleConvert(schedule.querySelectorAll("td")[1].innerText),
            member: listMember,
            seitansai,
          });
        });

        return scheduleList;
      });

      await browser.close();
      return res.status(200).json({ code: 200, result: scheduleDetailData });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ code: 500, messages: "Failed get data!" });
    }
  },
};

export default schedule;
