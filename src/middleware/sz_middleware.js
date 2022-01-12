const path=require('path');
const {getCurrentTime}=require('../tools/sz_dateTime')
const fs=require('fs');
const {sendMail}=require('../tools/sz_email');
const {execSQL}=require("../tools/sz_mysql");
const {ResponseTemp} = require("../tools/sz_message");
//404中间件
let notFoundMF=function (notFoundFilePath){
    if(!path.isAbsolute(notFoundFilePath)){
        throw Error('必须传递一个绝对路径');
    }
    return (req,resp)=>{
        resp.status(404).sendFile(notFoundFilePath);
    }
}
//日志中间件
let rizhiMF= (req,resp,next)=>{
        //日志记录

        // let current=getCurrentTime();
        let method=req.method;
        let path=req.path;
        let params={};
        if(method.toLowerCase()==='get'){
            params=req.query;
        }else if(method.toLowerCase()==='post'){
            params=req.body;
        }
        let ua=req.headers['user-agent'];
        //写入系统日志
//         let result=`
// =================================================
//     请求时间:${current}
//     请求方法:${method}
//     请求路径:${path}
//     请求参数:${JSON.stringify(message)}
//     客户端信息:${ua}
// =================================================
// `
//         fs.appendFile(rizhiFilePath,result,()=>{
//             console.log('日志写入成功！')
//             //调用邮件中间件
//             sendMail('594135484@qq.com','启动报告',result);
//         });
        //写入系统数据库
        execSQL("insert into t_log (method,path,params,user_agent) values(?,?,?,?)",[method,path,JSON.stringify(params),ua]).then(result=>{
            console.log("记录日志成功！");
        });
        //继续执行
        next();

}

//错误中间件
let handleErrorMF=function (errorResponseFilePath){
    if (!path.isAbsolute(errorResponseFilePath)){
        throw Error("请传入一个绝对路径");
    }
    return  (err,req,resp,next)=>{
        //错误类型
        let err_type=err.name;
        //错误描述
        let err_msg=err.message;
        //错误堆栈
        let err_stack=err.stack;

        let info=`
    ===============================================
    错误类型:${err_type}
    错误描述:${err_msg}
    错误时间:${getCurrentTime()}
    错误堆栈:${err_stack}
    ===============================================
    `
        //1-写入日志 发送邮件
    //   fs.appendFile(errorFilePath,info,()=>{
    //   console.log('捕获到错误');
    //   resp.status(500).sendFile(errorResponseFilePath);
        //调用邮件中间件
    //  sendMail('594135484@qq.com','错误报告',info);
    //     });
        //2-写入数据库 发送邮件
        execSQL("insert into t_error (err_type,err_msg,err_stack) values (?,?,?)",[err_type,err_msg,JSON.stringify(err_stack)]).then(result=>{
            if (result.affectedRows>=1){
                //调用邮件中间件
                sendMail('594135484@qq.com','错误报告',info);
            }
})
        resp.status(500).sendFile(errorResponseFilePath);
    }
}
//跨域中间件
let crossDomainM=(req,resp,next)=>{
    resp.header("Access-Control-Allow-Origin","*")
    resp.header("Access-Control-Allow-Methods",'GET,PUT,POST,DELETE')
    resp.header("Access-Control-Allow-Headers","Content-Type")
   next()
}
//工具中间件
let toolM=(req,resp,next)=>{
    resp.tool={
        execSQL,ResponseTemp:function (code,msg,data){
            return{
                code,
                msg,
                data
            }
        }
    }
    next();
}
//回调参数
module.exports={
    notFoundMF,
    rizhiMF,
    handleErrorMF,
    crossDomainM,
    toolM
}