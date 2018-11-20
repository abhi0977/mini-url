const express = require('express')
const app = express()
const port = 3002
const mongoose = require('mongoose');
const util = require('./utils/util')
const config = require('./config/defaultConfig')
const Url = require('./model/UrlSchema')
const passport = require("passport");
mongoose.connect(config.database.development, { useNewUrlParser: true });

app.set('trust proxy', true);

var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

// app.use(passport.initialize());
// require('./routes/passport/config');

var geoip = require('geoip-lite');


// app.get('/', (req, res) => {
//     util.addUrl('google.com','localhost:3000/abcdef')
//     // console.log(util.inspect(req, false, null, true /* enable colors */))
//     res.send("ll")
// })

app.get('/get/:url', (req, res) => {
    // util.findUrl(req.params.url).then((data) => res.redirect('http://'+data)).catch((err) => res.send(err))
    // util.increaseCount('localhost:3000/abcdef')
    util.findUrl(req.params.url)
    .then((data) => {
    var geo = geoip.lookup(req.ip);
    let userData = {
        ip : JSON.stringify(req.ip),
        browser : req.headers["user-agent"],
        language : req.headers["accept-language"],
        country : (geo ? geo.country: "Unknown"),
        region : (geo ? geo.region: "Unknown")
    }

    util.pushUserData(req.params.url,userData).then((data) => console.log(data)).catch((err) => console.log(err))
    res.redirect('http://' + data)
    })
    .catch((err) => {
        return res.send(err)
    })
})

app.use('/api', require('./routes/api/data'));
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

