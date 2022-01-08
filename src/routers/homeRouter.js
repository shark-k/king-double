const  express=require("express");

//创建路由中间件
let router=express.Router();
//获取网站联系方式和配置信息
router.get("/web_config",(req,resp)=>{
   resp.send({
       test:"成功！"
   }) ;
});


//导出路由中间件
module.exports= router;