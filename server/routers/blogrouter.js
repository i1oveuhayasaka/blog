const express = require('express');
const router = express.Router();
// const { v4: uuidv4 } = require('uuid');
const { db, genid } = require('../db/dbUtils');

router.get('/content',async (req,res) => {
    let {id}=req.query
    let { err, rows }=await db.async.all('select `content`,`title` from `blog` where `id` =?',id)
    if (err == null) {
        res.send({
            code: 200,
            msg: '获取成功',
            rows
        })
    }
    else {
        res.send({
            code: 500,
            msg: '获取失败'
        })
    }
})
router.get('/search', async (req, res) => {

    let { keyword, category_id, page, pagesize } = req.query;
    keyword = keyword == null ? '' : keyword;
    category_id = category_id == null ? 0 : category_id;
    page = page == null ? 1 : page;
    pagesize = pagesize == null ? 10 : pagesize;
    let params=[];
    let sql=[];
    if(category_id!=0){
        sql.push(" `category_id`= ? ")
        params.push(category_id)
    }
    if(keyword!=0){
        sql.push(" (`title` like ? or `content` like ?) ")
        params.push("%"+keyword+"%")
        params.push("%"+keyword+"%")
    }
    let wheresql,searchsql=""
    if(sql.length>0){
        wheresql = "where"+sql.join(" and ")
    }
    searchsql="select * from `blog` "+ wheresql+ " order by `create_time` desc limit ?,?";
    let sparams=params.concat([(page-1)*pagesize,pagesize]);
    let countsql="select count(*) as count from `blog`"+ wheresql ;

    let searchresult = await db.async.all(searchsql,sparams);
    let countresult=await db.async.all(countsql,params);
    console.log(searchresult);
    console.log(countresult);

    if (searchresult.err == null && countresult.err==null ) {
        res.send({
            code: 200,
            msg: '查询成功',
            data:{
                keyword,
                category_id,
                page,
                pagesize,
                rows:searchresult.rows,
                count:countresult.rows[0].count
            }
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
    let { category_id, title, content } = req.body;
    let create_time = new Date().getTime();
    let sql = 'insert into `blog` (`id`,`category_id`,`title`,`content`,`create_time`) values (?,?,?,?,?)';
    let out = await db.async.run(sql, [genid.NextId(), category_id, title, content, create_time]);
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
    let { id, category_id, title, content } = req.body;
    let sql = 'update `blog` set `category_id` =?,`title`=?,`content`=? where `id`=?';
    let out = await db.async.run(sql, [category_id, title, content, id]);
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
    let sql = 'delete from `blog`  where `id`=? ;';
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