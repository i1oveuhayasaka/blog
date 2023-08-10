const express=require('express');
const router =express.Router();
const{db,genid}=require('../db/dbUtils');

router.get('/test',async (req,res) => {
    // db.all('select * from `admin` ;',[],(err,rows) => {
    //     console.log(rows);
    // })
    let out = await db.async.all('select * from `admin`;',[]);

    res.send({
        id:genid.NextId(),
        out,
    })
})

module.exports= router;