

function money_check(){ 
    var money = document.myform.consumptionAmount.value; 
    if(!/^[0-9]*(\.[0-9]{1,2})?$/.test(money))
    { 
        document.getElementById('money_id').innerHTML="输入正确的金额(最多两位小数)";
        return false;
    }else{
        document.getElementById('money_id').innerHTML="";
        return true; 
        }
}





