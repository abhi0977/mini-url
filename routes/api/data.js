const express = require('express');
const router = express.Router();
const util = require('./../../utils/util')
const Url = require('./../../model/UrlSchema')

router.post('/create', (req, res, next) => {
    const { url, short_url } = req.body
    console.log(url, short_url)

    if (!url || !short_url)
        return res.send("no url or short url")
    else {
        util.addUrl(url, short_url).then((data) => {
            return res.send(data)
        }).catch((err) => {
            return res.send(err)
        })
    }
})

router.post('/all', (req,res) => {
    Url.find({},(err, data) => {
        if(data)
            return res.send(data)
        else
            return res.send("not found")
    })
})

module.exports = router;