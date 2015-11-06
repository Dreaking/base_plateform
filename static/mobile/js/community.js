var post_list = [];
function getSectionList()
{
    $.ajax({
        data: null,
        dataType: "json",
        type: "POST",
        url: '/user/community/section/list',
        success: function(data){
            if(data.status != 200)
            {
                console.log('status: ' + data.status);
                return;
            }
            var section_list = document.getElementById('section_list');
            data = data.data;
            $.each(data, function(){
                var a_tag = document.createElement('a');
                var li_tag = document.createElement('li');
                a_tag.innerHTML = this.section_name + '(' + this.post_count + ')';
                a_tag.href = "community_plate.html" + "?section_id=" + this.section_id  +
                        '&section_name=' + encodeURI(this.section_name);
                li_tag.appendChild(a_tag);
                section_list.appendChild(li_tag);
            });
        }
    });
}

function appendPostItem(data)
{
    var date = new Date(), currentDate = new Date();
    date.setTime(data.add_time * 1000);
    var time_str = null;
    function insertZeros(num)
    {
        if(num < 10)
            return '0' + num;
        else
            return num;
    }
    if(!(date.getFullYear() == currentDate.getFullYear() &&
        date.getMonth() == currentDate.getMonth() &&
        date.getDate() == currentDate.getDate()))
        time_str = date.getFullYear() + "." + insertZeros(date.getMonth() + 1) + '.' +
            insertZeros(date.getDate());
    else
        time_str = insertZeros(date.getHours()) + ':' + insertZeros(date.getMinutes()) + ':'+
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
    span_tag.innerHTML = '#' + data.section_name + '#' + data.title;
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
    if(is_refresh)
    {
        data.is_refresh = 1;
        post_list = [];
        var list = document.getElementById('post_list');
        while(list.children.length > 0)
            list.removeChild(list.children[0]);
        var header = document.createElement('li');
        header.className = 'newArticle';
        header.innerHTML = "最新帖子";
        list.appendChild(header);
    }
    else
    {
        data.is_refresh = 0;
        if(post_list.length == 0)
            return;
        else
            data.last_post_id = post_list[post_list.length - 1].post_id;
    }
    data.post_count = post_count;

    $.ajax({
        url: '/community/post/list',
        data: data,
        dataType: 'json',
        type: 'POST',
        success: function(data){

            if(data.status != 200)
            {
                console.log(data.status);
                return;
            }
            data = data.data;
            $.each(data, function(){
                appendPostItem(this);
            })
        }
    });
}

window.onload=function(){
    //var messageImage=document.getElementById('messageImage'),
    //    newMessage=document.getElementById('newMessage');
    //    messageImage.onclick=function(){
    //        if(newMessage.style.display!='block')
    //            newMessage.style.display='block';
    //        else
    //             newMessage.style.display='none';
    //    };
    getSectionList();
    getNewPostList(true, 10);
 };

$(window).scroll(function(){
    var totalheight = parseFloat($(window).height()) + parseFloat($(window).scrollTop());
    if ($(document).height() <= totalheight)
    {
		getNewPostList(false, 10);
    }
});
    