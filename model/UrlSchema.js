const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var UrlSchema = new Schema({
    url : String,
    short_url : String,
    info : [
        {
            ip : String,
            time : {
                type : Date,
                default : new Date().toISOString()
            },
            browser : String,
            language : String,
            country : String,
            region : String,
        }
    ]
})

var Url = mongoose.model('url', UrlSchema);

module.exports = Url;