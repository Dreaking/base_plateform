
function phone_check()
{ 
    var phones = document.myform.phone.value; 
    if(!/^1\d{10}$/.test(phones))
    { 
        document.getElementById('phone_id').innerHTML="请填写正确的手机号码";
        return false;
    }
    else
    {
        document.getElementById('phone_id').innerHTML="";
        return true; 
    }
}

function login(event)
{
    event.preventDefault();
    if(!phone_check())
        return;
    var phone = document.myform.phone.value;
    var pw = document.myform.pw.value;

    $.ajax({
        type: 'POST',
        url: '/user/login',
        data: {
            'username': phone,
            'password': pw
        },
        dataType: 'json',
        success: function(data){
            switch(data.status)
            {
                case 422:
                    document.getElementById('phone_id').innerHTML="帐号不存在";
                    break;
                case 430:
                    document.getElementById('pw_id').innerHTML="密码不正确";
                    break;
                case 200:
                    if(data.data.type < 2 || data.data.type > 5)
                    {
                        $.post('/user/logout');
                        document.getElementById('phone_id').innerHTML="帐号不存在";
                        return;
                    }
                    location = 'user.html';
                    break;
                case 700:
                    //TODO: 系统出错
                    break;
            }
        }
    });
}
