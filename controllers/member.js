import puppeteer from "puppeteer";

const member = {
  getAllMember: async (req, res) => {
    const browser = await puppeteer.launch({ headless: false });

    const page = await browser.newPage();

    try {
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

  getDetailMember: async (req, res) => {
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
          fullName: listDetail[0].innerText,
          birthday: listDetail[1].innerText,
          bloodType: listDetail[2].innerText,
          zodiac: listDetail[3].innerText,
          height: listDetail[4].innerText,
          nickname: listDetail[5].innerText,
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
