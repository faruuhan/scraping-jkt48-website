import puppeteer from "puppeteer";

const schedule = {
  getSchedule: async (req, res) => {
    const browser = await puppeteer.launch({ headless: false });

    const page = await browser.newPage();

    try {
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

  getDetailSchedule: async (req, res) => {
    const { idschedule } = req.params;

    const browser = await puppeteer.launch({ headless: false });

    const page = await browser.newPage();

    try {
      await page.goto(
        `https://jkt48.com/theater/schedule/id/${idschedule}?lang=id`
      );

      const scheduleDetailData = await page.evaluate(() => {
        const titleConvert = (title) => {
          return title.replaceAll("\n", "");
        };

        const dateConvert = (date) => {
          return date.replaceAll("\n", " ");
        };

        const scheduleList = [];

        const getTable = document.querySelectorAll(".table-pink__scroll table");

        const getRowTable = Array.from(
          getTable[1].querySelectorAll("tbody tr")
        );

        getRowTable.map((schedule) => {
          const listMember = [];
          const seitansai = [];
          schedule.querySelectorAll("td a").forEach((member) => {
            if (!member.getAttribute("style")) {
              listMember.push(member.innerText);
            } else {
              seitansai.push(member.innerText);
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

  getDetailSchedule: async (req, res) => {
    const { idschedule } = req.params;

    const browser = await puppeteer.launch({ headless: false });

    const page = await browser.newPage();

    try {
      await page.goto(
        `https://jkt48.com/theater/schedule/id/${idschedule}?lang=id`
      );

      const scheduleDetailData = await page.evaluate(() => {
        const titleConvert = (title) => {
          return title.replaceAll("\n", "");
        };

        const dateConvert = (date) => {
          return date.replaceAll("\n", " ");
        };

        const scheduleList = [];

        const getTable = document.querySelectorAll(".table-pink__scroll table");

        const getRowTable = Array.from(
          getTable[1].querySelectorAll("tbody tr")
        );

        getRowTable.map((schedule) => {
          const listMember = [];
          const seitansai = [];
          schedule.querySelectorAll("td a").forEach((member) => {
            if (!member.getAttribute("style")) {
              listMember.push(member.innerText);
            } else {
              seitansai.push(member.innerText);
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

  getTheaterSchedule: async (req, res) => {
    const browser = await puppeteer.launch({ headless: false });

    const page = await browser.newPage();

    try {
      await page.goto(`https://jkt48.com/theater/schedule?lang=id`);

      const scheduleDetailData = await page.evaluate(() => {
        const titleConvert = (title) => {
          return title.replaceAll("\n", "");
        };

        const dateConvert = (date) => {
          return date.replaceAll("\n", " ");
        };

        const scheduleList = [];

        const getTable = document.querySelectorAll(".table-pink__scroll table");

        const getRowTable = Array.from(
          getTable[1].querySelectorAll("tbody tr")
        );

        getRowTable.map((schedule) => {
          const listMember = [];
          const seitansai = [];
          schedule.querySelectorAll("td a").forEach((member) => {
            if (!member.getAttribute("style")) {
              listMember.push(member.innerText);
            } else {
              seitansai.push(member.innerText);
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
