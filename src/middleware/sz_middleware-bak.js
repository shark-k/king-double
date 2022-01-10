const path=require('path');
const {getCurrentTime}=require('../tool/sz_dateTime')
const fs=require('fs');
const {sendMail}=require('../tool/sz_email');

let notFoundMF=function (notFoundFilePath){
    if(!path.isAbsolute(notFoundFilePath)){
        throw Error('必须传递一个绝对路径');
    }
    return (req,resp)=>{
        resp.status(404).sendFile(notFoundFilePath);
    }
}

let rizhiMF=function (rizhiFilePath){

let handlerErrorMF=function (errorFilePath,errorResponseFilePath){
if(!path.isAbsolute(errorFilePath) || !path.isAbsolute(errorResponseFilePath)){
    throw Error('请输入一个绝对路径')
}
return (err,req,resp,next)=>{
    let current=getCurrentTime();
    let method=req.method;
    let path=req.path;
    let message={};
    if(method.toLowerCase()==='get'){
        message=req.query;
    }else if(method.toLowerCase()==='post'){
        message=req.params;
    }
    let ua=req.headers['user-agent'];
    let err_type=err.name;
    let err_msg=err.message;
    let err_stack=err.stack;
    let info=`
    ====================================
    请求时间:${current}
    请求方法:${method}
    请求路径:${path}
    请求参数:${JSON.stringify(message)}
    客户端信息:${ua}
    错误类型:${err_type}
    错误描述:${err_msg}
    错误事件:${getCurrentTime}
    错误堆栈:${err_stack}
    =====================================
    `
    fs.appendFile(errorFilePath,info,()=>{
        sendMail('594135484@qq.com','错误报告',info);
    });
    resp.status(500).sendFile(errorResponseFilePath)
}
}

}
module.exports={
    notFoundMF,
    rizhiMF,

}