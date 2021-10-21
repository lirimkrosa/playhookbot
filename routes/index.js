const express = require("express");
const router = express.Router();
const gplay = require("google-play-scraper");
const { IncomingWebhook } = require("@slack/webhook");

/* GET home page. */
router.get("/", (req, res) => {
  res.send({ title: "it works!" });
});

router.get("/api", async (req, res, next) => {
  try {
    const url = process.env.SLACK_WEBHOOK_URL || "SLACK_WEBHOOK_URL";
    const keyword = process.env.SEARCH_KEYWORD || "KEYWORD";
    const excludeAppId = process.env.EXCLUDE_APP_ID || "EXCLUDE_APP";

    const webhook = new IncomingWebhook(url);

    const results = await gplay.search({
      term: keyword,
      num: 250,
    });

    const matchingApps = results.filter(
      (app) => app.title.includes(keyword) && app.appId !== excludeAppId,
    );

    // Send notifications to Slack concurrently
    await Promise.all(
      matchingApps.map((app) =>
        webhook.send({ text: `${app.title} | URL: ${app.url}` }),
      ),
    );

    res.send(results);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
