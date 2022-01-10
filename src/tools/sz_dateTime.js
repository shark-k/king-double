//日期时间函数
function  getCurrentTime(){
    let date =new Date();
    let year=date.getFullYear();
    let month=date.getMonth()+1;
    let day=date.getDate();
    let hour=date.getHours();
    let min=date.getMinutes();
    let sec=date.getSeconds();
    return `${year}-${month}-${day}  ${hour}:${min}:${sec}`;
}
//日期函数
function  getCurrentDate(){
    let date =new Date();
    let year=date.getFullYear();
    let month=date.getMonth()+1;
    let day=date.getDate();
    return `${year}-${month}-${day} `;
}
module.exports={
    getCurrentTime,
    getCurrentDate
}