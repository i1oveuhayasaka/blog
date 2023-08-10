const express = require('express');
const multer = require('multer');
const app = express();
const path = require("path");
const port = 3000;
const { db, genid } = require('./db/dbUtils');
const updata = multer( {dest: './public/upload/temp'})

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');
    res.header('Access-Control-Allow-Methods', 'DELETE,PUT,GET,POST,OPTIONS');
    if (req.method == 'OPTIONS') res.sendStatus(200);
    else next();
});
app.use(express.json());
const TOKEN_PATH = "/_token"
app.all("*",  async (req, res, next) => {

    if (req.path.indexOf(TOKEN_PATH) > -1) {
        let { token } = req.headers;
        let result = await db.async.all("select * from `admin` where `token` = ?", [token]);

        if (result.err != null || result.rows.length == 0) {
            res.send({
                code: 403,
                msg: "请先登录"
            })
            return;
        }
        else next();
    }
    else next();
})
app.use('/test', require('./routers/testrouter'));
app.use('/admin', require('./routers/adminrouter'));
app.use('/category', require('./routers/categoryrouter'));
app.use('/blog', require('./routers/blogrouter'));
app.use('/upload', require('./routers/uploadrouter'));
app.use(updata.any());
app.use(express.static(path.join(__dirname, "public")))

app.get('/', (req, res) => {
    res.send('Hayasaka!')
})

app.listen(port, () => {
    console.log(`server running! http://localhost:${port}`);
})

