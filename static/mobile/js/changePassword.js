function pw_check()
{
    var pws = document.myform.pw.value; 
    if(!/^[A-Za-z0-9]+$/.test(pws)||pws.length>18||pws.length<6)
    { 
        document.getElementById('pw_id').innerHTML="密码需为6-18位的字母和数字组合";
        return false;
    }
    else
    {
        document.getElementById('pw_id').innerHTML="";
        return true; 
    }
}

function repw_check()
{
    var pws = document.myform.pw.value; 
    var repws = document.myform.repw.value;   
    if(pws!=repws)  
    {
        document.getElementById('repw_id').innerHTML="密码不一致,请重新输入";
        return false;   
    }
    else
    {
         document.getElementById('repw_id').innerHTML="";
         return true;
    }
}

function changePassword(event)
{
    event.preventDefault();
    if(!(pw_check && repw_check()))
        return;
    var pw = document.myform.pw.value,
        origin_pw = document.myform.origin_pw.value;
    $.ajax({
        type: 'POST',
        url: '/user/password/change',
        dataType: 'json',
        data: {
            old_password: origin_pw,
            new_password: pw
        },
        success: function(data){
            console.log(data);
            switch (data.status)
            {
                case 200:
                    location = 'user.html';
                    break;
                case 411:
                    location = 'load.html';
                    break;
                case 430:
                    document.getElementById('origin_pw_id').innerHTML="密码不正确";
                    break;
                case 700:
                    break;
            }
        }
    });

}