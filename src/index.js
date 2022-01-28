const  express=require("express");
const path=require("path");
//前台路由器
const homeRouter=require("./routers/client/homeRouter");
const teacherRouter=require("./routers/client/teacherRouter");
const courseRouter=require("./routers/client/courseRouter");
const articleRouter=require("./routers/client/articleRouter");
const searchRouter=require("./routers/client/searchRouter");
const userRouter=require("./routers/client/userRouter");
const {notFoundMF, rizhiMF, handleErrorMF,crossDomainM,toolM}=require("./middleware/sz_middleware");
const url = require("url");
//后台路由器
const mAdCourseRouter = require("./routers/manager/adCourseRouter");
const mAdminRouter = require("./routers/manager/adminRouter");
const mArticleRouter = require("./routers/manager/articleRouter");
const mCategoryRouter = require("./routers/manager/categoryRouter");
const mConfigRouter = require("./routers/manager/configRouter");
const mCourseRouter = require("./routers/manager/courseRouter");
const mOverViewRouter = require("./routers/manager/overViewRouter");
const mStatisticsRouter = require("./routers/manager/statisticsRouter");
const mTeacherRouter = require("./routers/manager/teacherRouter");

// PM2:
// Node 进程管理工具: 性能监控, 负载均衡, 自动重启...
// 安装: yarn global add pm2; npm install pm2 -g
//cmd运行：pm2 start index.js
//查看运行进程:pm2 list
//重启某个进程:pm2 restart index
//停止某个进程:pm2 stop index
//创建服务程序
let app=express();
//跨域中间件
app.use(crossDomainM);
//工具中间件
app.use(toolM);
//处理post请求中间件
app.use(express.json(),express.urlencoded({extended:true}));
// 日志中间件
app.use(rizhiMF)
// //静态资源中间件
app.use(express.static(path.resolve(__dirname,"public")));
// //挂载路由中间件
app.use("/api/client/home",homeRouter);
app.use("/api/client/teacher",teacherRouter);
app.use("/api/client/course",courseRouter);
app.use("/api/client/article",articleRouter);
app.use("/api/client/search",searchRouter);
app.use("/api/client/user",userRouter);

app.use("/api/manager/ad_course", mAdCourseRouter);
app.use("/api/manager/admin", mAdminRouter);
app.use("/api/manager/article", mArticleRouter);
app.use("/api/manager/category", mCategoryRouter);
app.use("/api/manager/config", mConfigRouter);
app.use("/api/manager/course", mCourseRouter);
app.use("/api/manager/over_view", mOverViewRouter);
app.use("/api/manager/statistics", mStatisticsRouter);
app.use("/api/manager/teacher", mTeacherRouter);
//404中间件
app.use(notFoundMF(path.resolve(__dirname,"./defaultPages/404.html")));
//500中间件
app.use(handleErrorMF(path.resolve(__dirname,"./defaultPages/500.html")));
//创建程序监听
app.listen(5000,()=>{
    console.log("服务器启动成功！")
})


