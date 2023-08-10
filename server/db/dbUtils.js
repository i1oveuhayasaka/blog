const sqlite3 = require('sqlite3').verbose();
const GenId = require('../utils/SnowFlake');
const path = require('path');
// const { resolve } = require('path');

var db = new sqlite3.Database(path.join(__dirname,'blog.sqlite3'));
const genid = new GenId({WorkerId:1});

db.async={}

db.async.all= (sql,params) => {
return new Promise((resolve,rej) => {
    db.all(sql,params,(err,rows) => {
        resolve({err,rows}) 
    })
})
}

db.async.run= (sql,params) => {
    return new Promise((resolve,rej) => {
        db.run(sql,params,(err,rows) => {
             resolve({err,rows})  
        })
    })
}

module.exports={
    db,genid
}