const  express=require("express");
// const  {execSQL}=require("../tools/sz_mysql");
//创建路由中间件
let router=express.Router();

//1、获取网站联系方式和配置信息
router.get("/web_config",(req,resp)=>{
   resp.tool.execSQL(`
  SELECT
        wechat_qrcode,
        mini_program,
        wb_qrcode,
        app,
        tel 
   FROM
        t_config 
        LIMIT 1`).then(result=>{
            if (result.length>0){
                resp.send(resp.tool.ResponseTemp(0,"查询成功！",result[0]));
            }else {
                resp.send(resp.tool.ResponseTemp(1,"查询失败！", {}));
            }

   })
});
//2、获取导航菜单
router.get("/nav",(req,resp,next)=>{
    resp.tool.execSQL(`
    SELECT
        id,
        title,
        route 
    FROM
        t_nav
    `).then(result=>{
        resp.send(resp.tool.ResponseTemp(0,"导航菜单数据",result));
    })
})
//3、获取焦点图课程信息
router.get("/focus_img",(req,resp,next)=>{
    resp.tool.execSQL(`
        SELECT
            id,
            title,
            ad_url,
            course_id 
        FROM
            t_ad
        WHERE 
            is_show=1;`).then(result=>{
                resp.send(resp.tool.ResponseTemp(0,"查询焦点图数据",result));
    })
})
//4、获取热门好课
router.get("/hot_course",(req,resp,next)=>{
    resp.tool.execSQL(`
     SELECT
        t_course.id,
        title,
        fm_url,
        is_hot,
            COUNT( t_comments.id ) AS comment_tool,
            avg(IFNULL(t_comments.score,0) ) AS comment_avg  
     FROM
        t_course
     LEFT JOIN t_comments ON t_course.id = t_comments.course_id 
    GROUP BY
        t_course.id 
    HAVING
        is_hot = 1 
        LIMIT 5;`).then(result=>{
        resp.send(resp.tool.ResponseTemp(0,"查询热门课程数据",result));
    })
})
//5、获取明星讲师
router.get("/star_teacher",(req,resp,next)=>{
    resp.tool.execSQL(`
    SELECT
        id,
        name,
        header,
        position,
        intro
    FROM
        t_teacher 
    WHERE
        is_star = 1 
        LIMIT 6;`).then(result=>{
        resp.send(resp.tool.ResponseTemp(0,"查询明星讲师数据",result));
    })
})
//6、获取最新文章
router.get("/last_news",(req,resp,next)=>{
    resp.tool.execSQL(`
    SELECT
        id,
        title,
        create_time
    FROM
        t_news
    ORDER BY
        create_time DESC
    LIMIT 10;
    `).then(result=>{
        resp.send(resp.tool.ResponseTemp(0,"查询最新文章数据",result));
    })
})
//导出路由中间件
module.exports= router;