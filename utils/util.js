let util = {}
const Url = require('./../model/UrlSchema')

util.addUrl = function(url, shortUrl){
    return new Promise((resolve, reject) => {
        Url.findOne({
            short_url : shortUrl,
        }, (err, data) => {
            if(!data){
                Url.create({
                        short_url : shortUrl,
                        url : url
                    }, (err, data) => {
                        console.log(err, data)
                        resolve(data)
                    })
            }else{
                reject('already exist')
            }
        })
    })
}


util.findUrl = function(url){
    return new Promise((resolve, reject) => {
        Url.findOne({
            short_url : url
        }, (err, data) => {
            if(data)
                resolve(data.url)
            else
                reject('not found')
        })
    })
}

util.increaseCount = function(url){
    Url.findOneAndUpdate({ short_url: url }, { $inc: { count: 1 } },(err, res) => {
        console.log(err, res)
    })
}

util.pushUserData = (url, data) => {
    return new Promise((resolve, reject) => {
        Url.update({ short_url :  url }, {
            $push: {
                info : data
           }       
        }, (err, data) => {
            if(err)
                reject(err)
            else
                resolve(data)  
        })
    })
}



module.exports = util