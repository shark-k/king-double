const  express=require("express");

//创建路由中间件
let router=express.Router();
//文章列表
router.get("/list",(req,resp,next)=>{
    const {page_num=1,page_size=5}=req.query;
    resp.tool.execSQLAutoResponse(`
    SELECT
            id,
            title,
            intro,
            create_time 
    FROM
            t_news 
    ORDER BY
            create_time DESC
            LIMIT ${(page_num-1)*page_size},${page_size};

`,"文章列表信息")
})
//文章详情
router.get("/detail/:id",(req,resp,next)=>{
    const {id}=req.params;
    resp.tool.execSQLAutoResponse(`
    SELECT
        id,
        title,
        create_time,
        content 
    FROM
        t_news 
    WHERE
        id =${id}
    
`,"文章详情信息",results=>{
        if (results.length>=1){
            return results[0];
        }else{
            return  {};
        }

    })
})
//导出路由中间件
module.exports= router;