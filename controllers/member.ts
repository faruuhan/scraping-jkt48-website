import puppeteer from "puppeteer";
import { Request, Response } from "express";

const member = {
  getAllMember: async (req: Request, res: Response) => {
    const browser = await puppeteer.launch({ headless: false });

    const page = await browser.newPage();

    try {
      await page.goto("https://jkt48.com/member/list?lang=id");

      const memberData = await page.evaluate(() => {
        const getID = (url: string) => {
          return url.substr(18).split("?")[0];
        };

        const memberList: HTMLElement[] = Array.from(
          document.querySelectorAll(".row-all-10 .col-4 .entry-member")
        );

        const data = memberList.map((member) => ({
          id: getID(member.querySelector("a").getAttribute("href")),
          image:
            "https://jkt48.com" +
            member.querySelector("a img").getAttribute("src"),
          name: member.querySelector("a img").getAttribute("alt"),
          memberStatus: member
            .querySelector("a img")
            .getAttribute("src")
            .includes("v=")
            ? "Reguler"
            : "Trainee",
        }));

        return data;
      });

      await browser.close();

      return res.status(200).json({ code: 200, result: memberData });
    } catch (error) {
      await browser.close();
      return res.status(500).json({ code: 500, messages: "Failed get data!" });
    }
  },

  getDetailMember: async (req: Request, res: Response) => {
    const { idmember } = req.params;

    const browser = await puppeteer.launch({ headless: false });

    const page = await browser.newPage();

    try {
      await page.goto(`https://jkt48.com/member/detail/id/${idmember}?lang=id`);

      const detailMember = await page.evaluate(() => {
        const listDetail = document.querySelectorAll(
          ".row .col-12 .entry-mypage__item .d-flex .entry-mypage__item--content"
        );

        const data = {
          image:
            "https://jkt48.com" +
            document
              .querySelector(".entry-mypage__profile img")
              .getAttribute("src"),
          fullName: (listDetail[0] as HTMLHeadElement).innerText,
          birthday: (listDetail[1] as HTMLHeadElement).innerText,
          bloodType: (listDetail[2] as HTMLHeadElement).innerText,
          zodiac: (listDetail[3] as HTMLHeadElement).innerText,
          height: (listDetail[4] as HTMLHeadElement).innerText,
          nickname: (listDetail[5] as HTMLHeadElement).innerText,
        };

        return data;
      });

      await browser.close();

      return res.status(200).json({ code: 200, result: detailMember });
    } catch (error) {
      await browser.close();
      return res.status(500).json({ code: 500, messages: "Failed get data!" });
    }
  },
};

export default member;
