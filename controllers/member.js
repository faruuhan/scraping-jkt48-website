import puppeteer from "puppeteer";

const member = {
  getAllMember: async (req, res) => {
    const browser = await puppeteer.launch({ headless: false });

    const page = await browser.newPage();

    await page.goto("https://jkt48.com/member/list?lang=id");

    const memberData = await page.evaluate(() => {
      const getID = (url) => {
        return url.substr(18).split("?")[0];
      };

      const memberList = Array.from(
        document.querySelectorAll(".row-all-10 .col-4 .entry-member")
      );

      const data = memberList.map((member) => ({
        id: getID(member.querySelector("a").getAttribute("href")),
        image:
          "https://jkt48.com" +
          member.querySelector("a img").getAttribute("src"),
        name: member.querySelector("a img").getAttribute("alt"),
        member:
          member.querySelector("a img").getAttribute("src").includes("v=") ===
          true
            ? "Reguler"
            : "Trainee",
      }));

      return data;
    });

    await browser.close();

    return res.status(200).json({ code: 200, result: memberData });
  },
};

export default member;
