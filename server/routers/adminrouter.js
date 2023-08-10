const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { db, genid } = require('../db/dbUtils');

router.post('/login', async (req, res) => {
    let { account, password } = req.body;
    let sql='select * from `admin` where `account`=? and `password`=?;'
    let out = await db.async.all(sql, [account, password]);
    let { err, rows } = out;

    if (err == null && rows.length > 0) {
        let login_token = uuidv4();
        await db.async.run('update `admin` set `token`=? where `id`=?;', [login_token, rows[0].id]);
        let a = rows[0];
        a.token = login_token; 
        a.password = '';

        res.send({
            code: 200,
            msg: '登陆成功',
            data: a
        })
    }
    else {
        res.send({
            code: 500,
            msg: '登录失败'
        })
    }
})

module.exports = router;