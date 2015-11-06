var notice_id = GetUrlParms()['notice_id'];

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

function applyActivity()
{
    document.getElementById('apply').innerHTML = '报名中';
    $('#apply').attr('disabled', true);
    $.ajax({
        url: '/activity/apply/add',
        data: {activity_id: notice_id},
        dataType: 'json',
        type: 'POST',
        success: function(data){
            if(data.status != 200)
            {
                $('#apply').attr('disabled', false);
                console.log(data.status);
                return;
            }
            document.getElementById('apply').innerHTML = '报名成功';
        }
    });
}

window.onload = function(){
    $.ajax({
        url: '/info/notice/detail/get',
        data:{notice_id: notice_id},
        dataType: 'json',
        type: 'POST',
        success: function(data){
            if(data.status != 200)
            {
                console.log(data.status);
                return;
            }

            data = data.data;
            document.getElementById('title').innerHTML = data.title;
            document.getElementById('content').innerHTML = data.content;
            document.getElementById('add_time').innerHTML = getTimeString(data.add_time);
        }
    });
};
