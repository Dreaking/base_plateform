var phone_number = null;
var verify_code_md5 = null;

function phone_check(){ 
    var phones = document.myform.phone.value; 
    if(!/^1\d{10}$/.test(phones))
    { 
        document.getElementById('phone_id').innerHTML="请填写正确的手机号码";
        return false;
    }else{
        document.getElementById('phone_id').innerHTML="";
        return true; 
        }
}

function pw_check(){ 
    var pws = document.myform.pw.value; 
    if(!/^[A-Za-z0-9]+$/.test(pws)||pws.length>18||pws.length<6)
    { 
        document.getElementById('pw_id').innerHTML="密码需为6-18位的字母和数字组合";
        return false;
    }else{
        document.getElementById('pw_id').innerHTML="";
        return true; 
        }
}

function repw_check(){
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

function register_send_verify_code()
{
    if(!phone_check())
        return;
    document.getElementById('send_verify').value = "发送中";
    $('#send_verify').attr('disabled', true);
    $.ajax({
        url: '/user/verify/send',
        data: {
            mobile: document.myform.phone.value
        },
        dataType: 'json',
        type: 'POST',
        success: function(data){
            var status = data.status;
            data = data.data;
            if(status == 200)
            {
                phone_number = document.myform.phone.value;
                verify_code_md5 = data.verify_code_md5;
                document.getElementById('send_verify').value = "发送成功";
                return;
            }
            document.getElementById('send_verify').value = "发送验证码";
            $('#send_verify').attr('disabled', false);
            if (status == 420)
                document.getElementById('phone_id').innerHTML="手机号码已被注册";

            console.log(status);
        }
    });
}

$('#send_verify').click(register_send_verify_code);

function register_checkVerifyCode()
{
    var verify_code = document.getElementById('verify_code').value;
    if(verify_code_md5 != null && $.md5(verify_code) != verify_code_md5)
    {
        document.getElementById('verify_code_text').innerHTML = '验证码不正确';
        return false;
    }
    else
    {
        document.getElementById('verify_code_text').innerHTML = '';
        return true;
    }
}
$('#verify_code').blur(register_checkVerifyCode);

function register_confirm_send() {
    var verify_code = document.getElementById('verify_code').value;
    if (verify_code_md5 == null)
    {
        document.getElementById('verify_code_text').innerHTML = '请输入正确验证码';
        return;
    }
    if($.md5(verify_code) != verify_code_md5)
    {
        document.getElementById('verify_code_text').innerHTML = '验证码不正确';
        return;
    }
    if(!(pw_check() && repw_check()))
        return;

    $.ajax({
        url: '/user/register',
        data: {
            mobile: document.myform.phone.value,
            verify_code: verify_code,
            password: document.myform.pw.value
        },
        dataType: 'json',
        type: 'POST',
        success: function(data){
            var status = data.status;
            data = data.data;
            if(status == 200)
            {
                history.back();
            }
            else if(status == 422)
            {
            }
            else if(stauts == 700 || status == 701)
            {
            }


        }
    });
}


$('#confirm_send').click(register_confirm_send);

