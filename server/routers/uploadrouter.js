const express = require('express');
const router = express.Router();
// const updata = require('../app');
const multer=require("multer");
const fs = require("fs")
const { genid } = require('../db/dbUtils');

router.post('/rich_editor_upload',multer({dest:'./public/upload/temp'}).array("files"), async (req, res) => {
     console.log(req.files);
    if (!req.files) {
        res.send({
            "errno": 1,  
            "message": "上传失败"
        })
        return;
    }
    let files = req.files;
    let ret_files = []
    for (let file of files) {
        let file_ext = file.originalname.substring(file.originalname.lastIndexOf(".") + 1)
        let file_name = genid.NextId() + "." + file_ext;
        fs.renameSync(
            process.cwd() + "/public/upload/temp/" + file.filename,
            process.cwd() + "/public/upload/" + file_name
        )
        ret_files.push("/upload/" + file_name)
    }
    res.send({
        "errno":0,
        "data":{
                "url": ret_files[0]  //图片 src
        }
    })
})

module.exports = router;