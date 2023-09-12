import puppeteer from "puppeteer";

const schedule = {
  getSchedule: async (req, res) => {
    try {
      const browser = await puppeteer.launch({ headless: false });

      const page = await browser.newPage();

      await page.goto("https://jkt48.com/calendar/list?lang=id");

      const scheduleData = await page.evaluate(() => {
        const dateConvert = (date) => {
          return date.replace("\n", " ");
        };

        const categoryFilter = (category) => {
          switch (category.substr(8).split(".")[1]) {
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

        const scheduleList = Array.from(
          document.querySelectorAll(".entry-schedule__calendar .table tbody tr")
        );

        const data = scheduleList.map((schedule) => ({
          date: dateConvert(schedule.querySelector("td h3").innerText),
          event: Array.from(schedule.querySelectorAll("td .contents"))?.map(
            (event) => ({
              title: event.querySelector("p a")?.innerText,
              category: categoryFilter(
                event.querySelector("span img").getAttribute("src")
              ),
            })
          ),
        }));

        const result = {
          period: document.querySelector(
            ".entry-schedule__header .entry-schedule__header--center"
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
};

export default schedule;
