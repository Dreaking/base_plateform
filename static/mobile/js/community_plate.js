var post_list = [];
var section_id = GetUrlParms()['section_id'];
var section_name = GetUrlParms()['section_name'];

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

function appendPostItem(data)
{
    var date = new Date(), currentDate = new Date();
    date.setTime(data.add_time * 1000);
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


    var str = '<i class="iconfont">&#xe600;</i>回复(' +
        data.reply_count + ')<time>' + time_str + '</time>';

    var span_tag = document.createElement('span');
    var reply_span_tag = document.createElement('span');
    var a_tag = document.createElement('a');
    var li_tag = document.createElement('li');
    reply_span_tag.className = 'replyRuantity';
    reply_span_tag.innerHTML = str;
    span_tag.className = 'arctileTitle';
    span_tag.innerHTML = data.title;
    a_tag.href = "community_myArticle.html" + "?post_id=" + data.post_id;
    a_tag.appendChild(span_tag);
    a_tag.appendChild(reply_span_tag);
    li_tag.appendChild(a_tag);

    document.getElementById('post_list').appendChild(li_tag);
    post_list.push(data);
}


function getNewPostList(is_refresh, post_count)
{
    var data = {};
    if (is_refresh)
    {
        data.is_refresh = 1;
        post_list = [];
        var list = document.getElementById('post_list');
        while (list.children.length > 0)
            list.removeChild(list.children[0]);
    }
    else {
        data.is_refresh = 0;
        if (post_list.length == 0)
            return;
        else
            data.last_post_id = post_list[post_list.length - 1].post_id;
    }
    data.post_count = post_count;
    data.section_id = section_id;

    $.ajax({
        url: '/community/post/list',
        data: data,
        dataType: 'json',
        type: 'POST',
        success: function (data) {

            if (data.status != 200) {
                console.log(data.status);
                return;
            }
            data = data.data;
            $.each(data, function () {
                appendPostItem(this);
            })
        }
    });
}

window.onload = function() {
    getNewPostList(true, 10);
    document.getElementById('section_name').innerHTML = section_name;
};

window.scroll = function(){
    var totalheight = parseFloat($(window).height()) + parseFloat($(window).scrollTop());
    if ($(document).height() <= totalheight)
    {
		getNewPostList(false, 10);
    }
};
