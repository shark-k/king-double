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
    let err_type=err.name;
    let err_msg=err.message;
    let err_stack=err.stack;
    let info=`
    ====================================
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
    handlerErrorMF
}