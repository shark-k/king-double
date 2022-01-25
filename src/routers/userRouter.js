const  express=require("express");
 const {execSQL} = require("../tools/sz_mysql");
const  multer = require("multer");
const  path=require("path");
const fs=require("fs");
//创建路由中间件
let router=express.Router();

//1、注册用户接口
router.post('/register',(req,resp,next)=> {
  const {account,password}=req.body;
//检测账号重复
    resp.tool.execSQL(`select id from t_user where account=?;`,[account]).then(result=>{
        if (result.length>0){
           resp.send(resp.tool.ResponseTemp(-2,"用户名已存在，请修改！",{}))
        }else {
            let nick_name="小撩";
            let header="/images/user/xl.jpg";
            let intro="我是中国人";
     resp.tool.execSQLTEMPAutoResponse(`
     insert into t_user (account,password,nick_name,header,intro) values (?,?,?,?,?);
     `,[account,password,nick_name,header,intro],"注册成功！",result=>{
         if (result.affectedRows>0){
             return{
                 id:result.insertId,
                 account,
                 nick_name,
                 header,
                 intro
             }
         }
     })
        }

    })
    }
   )
//2、登录接口
router.post('/login',(req,resp,next)=>{
   const {account,password}=req.body;

   resp.tool.execSQLTEMPAutoResponse(`
   select id ,account,nick_name,header,intro from t_user where account=? and password=?
   `,[account,password],"验证信息",result=>{
       if (result.length>0){
           return result[0]
       }
           return {
           id:-1,
           message:"用户名或密码错误"}

   })
})
//3、学习历史记录
router.get('/study_history',(req,resp,next)=>{
   const {user_id}=req.query;
   if(!user_id){
       resp.send(resp.tool.ResponseTemp(-2,"请传入用户ID"))
       return;
   }
   resp.tool.execSQLTEMPAutoResponse(`
   SELECT
            t_study_course.*,
        count( t_course_outline.id ) AS t_course_outline_count 
    FROM
        (
    SELECT
            t_study_history.user_id,
            t_study_history.id,
            t_study_history.course_id,
            t_course.title AS course_title,
            t_course.fm_url AS course_fm_url,
            t_course.is_hot AS course_is_hot,
    count( t_study_history.outline_id ) AS learned_count 
    FROM
            t_study_history
            LEFT JOIN t_course ON t_study_history.course_id = t_course.id 
    WHERE
            user_id = ${user_id}
    GROUP BY
            course_id 
    ) AS t_study_course
        LEFT JOIN t_course_outline ON t_course_outline.course_id = t_study_course.course_id 
    GROUP BY
    t_study_course.course_id;
   `,"获取学习记录信息")
})
//4、学习历史记录新增/更新
router.post('/update_study_history',(req,resp,next)=>{
   //is_finish:1 代表学完课程，否则代表正在学
    const {user_id,course_id,outline_id,is_finish='0'}=req.body;
    resp.tool.execSQL(`
    SELECT
            count(*) AS is_learned 
    FROM
            t_study_history 
    WHERE
            user_id = ? 
            AND outline_id = ?;
    `,[user_id,outline_id]).then(result=>{
        let is_learned=result[0].is_learned;
        if (is_learned){
           //更新
            resp.tool.execSQLTEMPAutoResponse(`
            UPDATE t_study_history 
                    SET state = ?
            WHERE
                    user_id =?
            AND outline_id = ?;
            `,[""+is_finish==="0" ?1:2,user_id,outline_id],"更新成功！",result=>({}))
        }else{
          //新增
        resp.tool.execSQLTEMPAutoResponse(`
        INSERT INTO t_study_history ( user_id, course_id, outline_id, state )
            VALUES
                (?,?,?,?);
        `,[user_id,course_id,outline_id,""+is_finish==="0" ?1:2,user_id,outline_id],"插入成功！",result=>({}))
        }
    })
})
//5、头像上传/更新
let uploader=multer({dest:path.resolve(__dirname,"../public/images/user")})
router.post("/update_header",uploader.single("header"),(req,resp,next)=>{
    let file=req.file;
    let {user_id}=req.body;
    // console.log(file);
    //获取扩展名
    let extName=path.extname(file.originalname);
    //重新命名
    fs.renameSync(file.path,path.resolve(__dirname,"../public/images/user/",file.filename+extName));
    //删除旧图片
    resp.tool.execSQL(`
    select header from t_user where id=?;
    `,[user_id]).then(result=>{
        if (result.length>0){
            let userObj=result[0];
            let userHeaderPath=userObj.header;
            //不是默认头像
            if(userHeaderPath.toLowerCase()!=="/images/user/xl.jpg"){
                //删除图片
            fs.unlinkSync(path.resolve(__dirname,"../public"+userHeaderPath))
            }
                //更新图片
            let newPath=`/images/user/${file.filename+extName}`;
            resp.tool.execSQLTEMPAutoResponse(`
            update t_user set header =? where id =?;
            `,[newPath,user_id],"更新成功！",result=>{
                return{
                    user_id,
                    user_header:newPath
                }
            })

        }
    })

})


//导出路由中间件
module.exports= router;