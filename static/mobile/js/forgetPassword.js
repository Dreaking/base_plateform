var phone_number = null;
var verify_code_md5 = null;

function send_verify_code()
{
    if(!phone_check())
        return;

    document.getElementById('send_verify').value = "发送中";
    $('#send_verify').attr('disabled', true);
    $.ajax({
        url: '/user/password/forget',
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
            }
            else
            {
                document.getElementById('send_verify').value = "发送验证码";
                $('#send_verify').attr('disabled', false);
            }
        }
    });
}

$('#send_verify').click(send_verify_code);





function confirm_send() {
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
        url: '/user/password/verify',
        data: {
            mobile: document.myform.phone.value,
            verify_code: verify_code,
            new_password: document.myform.pw.value
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


$('#confirm_send').click(confirm_send);

function checkVerifyCode()
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
$('#verify_code').blur(checkVerifyCode);

