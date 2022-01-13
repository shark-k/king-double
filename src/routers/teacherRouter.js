const  express=require("express");

//创建路由中间件
let router=express.Router();
//1、获取讲师信息:支持分页+讲师筛选
router.get("/list",(req,resp,next)=>{
   //1 明星讲师 0 非明星讲师 -1全部讲师
    const {page_num=1,page_size=5,is_star="-1"}=req.query;
    resp.tool.execSQLTEMPAutoResponse(`
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
            is_star in (${""+is_star ==="-1" ? "0,1" :is_star})
        LIMIT  ${(page_num-1)*page_size},${page_size};   
     
            `)
});
//2、获取讲师详情
router.get("/detail/:id",(req,resp,next)=>{
    const {id}=req.params;
    if (!id){
        resp.send(resp.tool.ResponseTemp(-2,"必须填写id"));
        return;
    }
    Promise.all([resp.tool.execSQL(`
    SELECT
        id,
        name,
        header,
        position,
        intro,
        is_star 
    FROM
        t_teacher 
    WHERE
        id = ${id};
    `), resp.tool.execSQL(`

            SELECT
                t_course.id,
                teacher_id,
                title,
                fm_url,
                is_hot,
                COUNT( t_comments.id ) AS comment_tool,
                avg( IFNULL( t_comments.score, 0 ) ) AS comment_avg 
            FROM
                t_course
                LEFT JOIN t_comments ON t_course.id = t_comments.course_id 
            GROUP BY
                t_course.id 
                HAVING teacher_id=${id};
            `)]).then(([teacherResult,courseResult])=>{
                if (teacherResult>=1){
                    let teacher=teacherResult[0];
                    teacher.courses=courseResult;
                    resp.send(resp.tool.ResponseTemp(0,"讲师详情请求数据",teacher));
                }else {
                    resp.send(resp.tool.ResponseTemp(0,"讲师详情请求数据",{}));
                }

    })

})
//导出路由中间件
module.exports= router;