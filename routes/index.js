var express = require('express');
var router = express.Router();
var gplay = require('google-play-scraper');
const { IncomingWebhook } = require('@slack/webhook');

/* GET home page. */
router.get('/', function(req, res, next) {

  
  res.send({ title: 'it works!' });
});


router.get('/api', function(req, res, next) {


  const url = "SLACK_WEBHOOK_URL";
  const webhook = new IncomingWebhook(url);
  gplay.search({
    term: "KEYWORD",
    num: 250
  }).then((result)=>{

    result.map((value)=>{

      if (value.title.includes("KEYWORD") && value.appId != "EXCLUDE_APP"){

        (async () => {
          await webhook.send({
            text: value.title+ ` | URL: ${value.url}`
          })
        })();
      }

     
    })
    res.send(result)
    
  }

  

  );

});

module.exports = router;
