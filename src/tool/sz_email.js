const nodemailer=require('nodemailer');
//创建传输器
let transporter=nodemailer.createTransport({
    host:'smtp.qq.com',//QQ:smtp.qq.com;网易:smtp.163.com
    secureConnection:true,//use SSL
    port:465,
    secure:true,//secure:true 对应port 465;secure:false 对应port 587
    auth:{
        user:'594135484@qq.com',
        pass:'rmgpxlmxgcjebdaj'
    }
});
function sendMail(toUser,title,content){
    //设置邮件内容
    let mailOptions={
        //发件人
        from:'594135484@qq.com',
        //收件人
        to:toUser,
        //邮件主题
        subject:title,
        // text:'快点检查',
        //邮件内容
        html:content,
        //附件
        attachments:[
            {
                filename:'content.txt',
                content
            }
        ]
    };
//调用发送方法
    transporter.sendMail(mailOptions).then(result=>{
        console.log(`Message:${result.messageId}`);
        console.log(`sent:${result.response}`);
    })
}
module.exports={
    sendMail
}