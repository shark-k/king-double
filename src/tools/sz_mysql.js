const mysql=require('mysql');
//创建连接池
let pool = mysql.createPool({
    connectionLimit:10,         /*最大连接数*/
    host: '192.168.10.3',          /*主机地址*/
    // host:"localhost",
    port:3306,                  /*设置端口号，不设置默认3306*/
    user: 'root',               /*数据库用户名*/
    password : 'admin123',      /*数据库密码*/
    database : 'shoplike'       /*数据库名称*/
});
function execSQL(sqlTemp,values=[],successCB,failCB){
    return new Promise((resolve, reject)=>{
        pool.query(sqlTemp,values,function (error,results,fields){
            if (error){
                if(typeof failCB==="function"){
                    failCB(error);
                }
                reject(error);
            }else{
                if(typeof successCB==="function"){
                    successCB(results);
                }
                resolve(results);
            }
        });
    })
}
module.exports={
    execSQL
}