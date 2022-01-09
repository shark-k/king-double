const  express=require("express");
const homeRouter=require("./routers/homeRouter");

//创建服务程序
let app=express();

//挂载路由中间件
app.use("/",homeRouter);
abc();

//创建程序监听
app.listen(5000,()=>{
    console.log("服务器启动成功！")
})


