const  express=require("express");
const path=require("path");
const homeRouter=require("./routers/homeRouter");
const teacherRouter=require("./routers/teacherRouter");
const courseRouter=require("./routers/courseRouter");
const articleRouter=require("./routers/articleRouter");
const searchRouter=require("./routers/searchRouter");
const {notFoundMF, rizhiMF, handleErrorMF,crossDomainM,toolM}=require("./middleware/sz_middleware");
const url = require("url");
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
app.use("/home",homeRouter);
app.use("/teacher",teacherRouter);
app.use("/course",courseRouter);
app.use("/article",articleRouter);
app.use("/search",searchRouter);
//404中间件
app.use(notFoundMF(path.resolve(__dirname,"./defaultPages/404.html")));
//500中间件
app.use(handleErrorMF(path.resolve(__dirname,"./defaultPages/500.html")));
//创建程序监听
app.listen(5000,()=>{
    console.log("服务器启动成功！")
})


