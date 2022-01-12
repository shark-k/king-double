
//定义查询信息函数
function ResponseTemp(code,msg,data){
    return{
        code,
        msg,
        data
    }
}
module.exports={
    ResponseTemp};