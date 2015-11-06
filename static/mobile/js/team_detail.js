var team_id = GetUrlParms()['team_id'];

function GetUrlParms()
{
    var args = {};
    var query = location.search.substring(1);//获取查询串
    var pairs = query.split("&");//在逗号处断开
    for (var i = 0; i < pairs.length; i++) {
        var pos = pairs[i].indexOf('=');//查找name=value
        if (pos == -1)   continue;//如果没有找到就跳过
        var argname = pairs[i].substring(0, pos);//提取name
        var value = pairs[i].substring(pos + 1);//提取value
        args[argname] = decodeURI(value);//存为属性
    }
    return args;
}

function getTimeString(time_stamp)
{
    var date = new Date(), currentDate = new Date();
    date.setTime(time_stamp * 1000);
    var time_str = null;

    function insertZeros(num)
    {
        if (num < 10)
            return '0' + num;
        else
            return num;
    }

    if (!(date.getFullYear() == currentDate.getFullYear() &&
        date.getMonth() == currentDate.getMonth() &&
        date.getDate() == currentDate.getDate()))
        time_str = date.getFullYear() + "." + insertZeros(date.getMonth() + 1) + '.' +
            insertZeros(date.getDate());
    else
        time_str = insertZeros(date.getHours()) + ':' + insertZeros(date.getMinutes()) + ':' +
            insertZeros(date.getSeconds());
    return time_str;
}


window.onload = function(){
    $.ajax({
        url: '/base/team/detail/get',
        data:{team_id: team_id},
        dataType: 'json',
        type: 'POST',
        success: function(data){
            if(data.status != 200)
            {
                console.log(data.status);
                return;
            }

            data = data.data;
            document.getElementById('team_name').innerHTML = data.team_name;
            if(!data.description)
                document.getElementById('team_description').innerHTML = '暂无简介';
            else
                document.getElementById('team_description').innerHTML = data.description;

            var src = null;
            if(data.logo_base64)
                src = 'data:image/png;base64,' + data.logo_base64;
            else
                src = '/static/default_team_logo.jpg';
            document.getElementById('team_logo').src = src;
        }
    });
};
