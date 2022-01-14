const  express=require("express");

//创建路由中间件
let router=express.Router();

//课程搜索
router.get("/course",(req,resp,next)=>{
   const {key=""}=req.query;
    resp.tool.execSQLAutoResponse(`
     SELECT
        t_course.id,
        title,
        fm_url,
        is_hot,
        category_id,
        count( t_comments.id ) AS comment_tool,
        avg( IFNULL( t_comments.score, 0 ) ) AS comment_avg 
    FROM
        t_course
        LEFT JOIN t_comments ON t_course.id = t_comments.course_id 
    GROUP BY
        t_course.id
        HAVING title like '%${key}%';
    `,"课程搜索结果")
})
//讲师搜索
router.get("/teacher",(req,resp,next)=>{
    const {key}=req.query;
    resp.tool.execSQLAutoResponse(`
    SELECT
            t_teacher.id,
            header,
            position,
            name,
            is_star,
        COUNT( t_course.id ) AS course_count,
            t_teacher.intro 
        FROM
            t_teacher
        LEFT JOIN t_course ON t_teacher.id = t_course.teacher_id 
        GROUP BY
            t_teacher.id
        HAVING 
            name like '%${key}%';
    `,"讲师搜索结果")
})
//文章搜索
router.get("/article",(req,resp,next)=>{
    const {key}=req.query;
    resp.tool.execSQLAutoResponse(`
    SELECT
	id,
	title,
	intro,
	create_time 
FROM
	t_news 
	WHERE title like '%${key}%'
ORDER BY
	create_time DESC;
    `,"文章搜索结果")
})
//全部搜索
router.get("/all",(req,resp,next)=>{
    const {key}=req.query;
    Promise.all([resp.tool.execSQL(`  SELECT
        t_course.id,
        title,
        fm_url,
        is_hot,
        category_id,
        count( t_comments.id ) AS comment_tool,
        avg( IFNULL( t_comments.score, 0 ) ) AS comment_avg 
    FROM
        t_course
        LEFT JOIN t_comments ON t_course.id = t_comments.course_id 
    GROUP BY
        t_course.id
        HAVING title like '%${key}%';`),resp.tool.execSQL(`   SELECT
            t_teacher.id,
            header,
            position,
            name,
            is_star,
        COUNT( t_course.id ) AS course_count,
            t_teacher.intro 
        FROM
            t_teacher
        LEFT JOIN t_course ON t_teacher.id = t_course.teacher_id 
        GROUP BY
            t_teacher.id
        HAVING 
            name like '%${key}%';`),resp.tool.execSQL(` SELECT
	        id,
	        title,
	        intro,
	        create_time 
    FROM
	        t_news 
	    WHERE title like '%${key}%'
    ORDER BY
	    create_time DESC;`)]).then(([courseResult,teacherResult,articleResult])=>{
          resp.send(resp.tool.ResponseTemp(0,"查找成功",{
              courseResult,teacherResult,articleResult
          }))
    })
})
//导出路由中间件
module.exports= router;