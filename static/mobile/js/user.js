function logout()
{
    $.ajax({
        type: 'POST',
        url: '/user/logout',
        data: null,
        dataType: 'json',
        success: function(data){
            location = 'load.html';
        }
    });
}

window.onload = function(){
    $.ajax({
        url: '/user/is/login',
        data: null,
        dataType: 'json',
        type: 'GET',
        success: function(data){
            if(data.status != 200)
            {
                console.log(data.status);
                return;
            }
            var a_tag = document.getElementById('my_team');
            data = data.data;
            if(data.type == 5)
                a_tag.href = '';
            else
                a_tag.href = 'wallet.html';
        }
    })
}