var post_id = GetUrlParms()['post_id'];
var post_detail = null;
var reply_list = [];

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

function appendReplyItem(data)
{
    var content_tag = document.createElement('span'),
        author_tag = document.createElement('span'),
        time_tag = document.createElement('time'),
        li_tag = document.createElement('li');
    content_tag.className = 'arctileReply';
    content_tag.innerHTML = data.content;
    author_tag.className = 'author';
    author_tag.innerHTML = data.nickname;
    time_tag.innerHTML = getTimeString(data.add_time);
    li_tag.appendChild(content_tag);
    li_tag.appendChild(author_tag);
    li_tag.appendChild(time_tag);

    document.getElementById('list').appendChild(li_tag);
    reply_list.push(data);
}


function getNewReplyList(is_refresh, reply_count)
{
    var data = {};
    if (is_refresh) {
        data.is_refresh = 1;
        reply_list = [];
        var list = document.getElementById('list');
        while (list.children.length > 0)
            list.removeChild(list.children[0]);
        showPostDetail();
    }
    else {
        data.is_refresh = 0;
        if (reply_list.length == 0)
            return;
        else
            data.last_reply_id = reply_list[reply_list.length - 1].reply_id;
    }
    data.reply_count = reply_count;
    data.post_id = post_id;

    $.ajax({
        url: '/community/reply/list',
        data: data,
        dataType: 'json',
        type: 'POST',
        success: function (data)
        {
            if (data.status != 200) {
                console.log(data.status);
                return;
            }
            data = data.data;
            $.each(data, function ()
            {
                appendReplyItem(this);
            })
        }
    });
}

function showPostDetail()
{
    var title_tag = document.createElement('span'),
        content_tag = document.createElement('span'),
        author_tag = document.createElement('span'),
        time_tag = document.createElement('time'),
        li_tag = document.createElement('li');
    title_tag.className = 'arctileTitle';
    content_tag.className = 'arctileShow';
    author_tag.className = 'author';
    title_tag.innerHTML = post_detail.title;
    content_tag.innerHTML = post_detail.content;
    author_tag.innerHTML = post_detail.nickname;
    time_tag.innerHTML = getTimeString(post_detail.add_time);
    li_tag.appendChild(title_tag);
    li_tag.appendChild(content_tag);
    li_tag.appendChild(author_tag);
    li_tag.appendChild(time_tag);
    document.getElementById('list').appendChild(li_tag);
}

function getPostDetail()
{
    $.ajax({
        url: '/community/post/detail/get',
        data: {post_id: post_id},
        dataType: 'json',
        type: 'POST',
        success: function (data)
        {
            if (data.status != 200) {
                console.log(data.status);
                return;
            }
            post_detail = data.data;
            getNewReplyList(true, 10);
        }
    });
}

window.onload = function ()
{
    getPostDetail();
    document.getElementById('delete_dialog').style.display='none';
};

$('#send_reply').click(function ()
{
    content = document.myform.reply_content.value;
    content = content.trim();
    if (content.length == 0 || content == '回复内容不能为空') {
        document.getElementById('reply_content').value = '回复内容不能为空';
        return;
    }

    $.ajax({
        url: '/community/reply/add',
        data: {post_id: post_id, content: content},
        dataType: 'json',
        type: 'POST',
        success: function (data)
        {
            if (data.status != 200) {
                console.log(data.status);
                return;
            }
            history.go(0);
        }
    });
});

