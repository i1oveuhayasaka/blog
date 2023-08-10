const express = require('express');
const router = express.Router();
// const { v4: uuidv4 } = require('uuid');
const { db, genid } = require('../db/dbUtils');

router.get('/list', async (req, res) => {

    let sql = 'select * from `category` ';
    let out = await db.async.all(sql, []);
    let { err, rows } = out;

    if (err == null && rows.length > 0) {
        res.send({
            code: 200,
            msg: '查询成功',
            rows
        })
    }
    else {
        res.send({
            code: 500,
            msg: '查询失败'
        })
    }
})

router.post('/_token/add', async (req, res) => {
    let { name } = req.body;
    let sql = 'insert into `category` (`id`,`name`) values (?,?)';
    let out = await db.async.run(sql, [genid.NextId(), name]);
    let { err, rows } = out;

    if (err == null) {
        res.send({
            code: 200,
            msg: '添加成功',
        })
    }
    else {
        res.send({
            code: 500,
            msg: '添加失败'
        })
    }
})

router.put('/_token/update', async (req, res) => {

    let { id, name } = req.body;
    let sql = 'update `category` set `name` =? where `id`=?';
    let out = await db.async.run(sql, [name, id]);
    let { err, rows } = out;

    if (err == null) {
        res.send({
            code: 200,
            msg: '修改成功',
        })
    }
    else {
        res.send({
            code: 500,
            msg: '修改失败'
        })
    }
})

router.delete('/_token/delete', async (req, res) => {
    let id = req.query.id;
    let sql = 'delete from `category`  where `id`=? ;';
    let out = await db.async.run(sql, [id]);
    let { err, rows } = out;

    if (err == null) {
        res.send({
            code: 200,
            msg: '删除成功',
        })
    }
    else {
        res.send({
            code: 500,
            msg: '删除失败'
        })
    }
})

module.exports = router;