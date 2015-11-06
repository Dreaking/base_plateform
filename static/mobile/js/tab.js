var list_name = 'inform_list';
var notice_list = [];

function appendListItem(data)
{
    var direction_url = null;
    if(list_name == 'inform_list')
        direction_url = 'information_inform.html';
    else if(list_name == 'match_list')
        direction_url = 'information_competition.html';
    else
        direction_url = 'information_activity.html';
    direction_url = direction_url + "?notice_id=" + data.notice_id;


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
    var a_tag = document.createElement('a');
    var li_tag = document.createElement('li');
    a_tag.href = direction_url;
    a_tag.innerHTML = data.title + '<time>' + time_str + '</time>';
    li_tag.appendChild(a_tag);
    document.getElementById(list_name).appendChild(li_tag);
    notice_list.push(data);
}

function getNewNoticeList(is_refresh, notice_count)
{
    if(!loading)
        loading = true;
    else
        return;
    var data = {};
    if(is_refresh)
    {
        data.is_refresh = 1;
        var list = document.getElementById(list_name);
        while(list.children.length > 0)
            list.removeChild(list.children[0]);
        notice_list = [];
    }

    else
    {
        data.is_refresh = 0;
        if(notice_list.length == 0)
            return;
        else
            data.last_notice_id = notice_list[notice_list.length - 1].notice_id;
    }
    data.notice_count = 10;

    var url = null;
    if(list_name == 'inform_list')
        url = '/info/base/list';
    else if(list_name == 'match_list')
        url = '/info/match/list';
    else
        url = '/info/activity/list';

    $.ajax({
        url: url,
        data: data,
        dataType: 'json',
        type: "POST",
        success: function(data){
            if (data.status != 200)
            {
                console.log(data.status);
                loading = false;
                return;
            }
            data = data.data;
            $.each(data, function(){
                appendListItem(this);
            });
            loading = false;
        },
        error: function(){
            loading = false;
        }
    });
}


window.onload=function(){
    //tab选项切换功能
	//获取鼠标点击的表情和要切换内容的元素
    var titles=document.getElementById('navTab').getElementsByTagName('li'),
        divs=document.getElementById('tabSection').getElementsByTagName('section');
    if(titles.length!=divs.length)
    	return;
    getNewNoticeList(true, 10);
    for(var i=0;i<titles.length;i++)
    {
    	titles[i].id=i;
    	titles[i].onclick=function(){
            if(this.id == 0)
                list_name = 'inform_list';
            else if(this.id == 1)
                list_name = 'match_list';
            else
                list_name = 'activity_list';
            //清楚所有li上的class
    		for(var j=0;j<titles.length;j++){
             titles[j].className='';
             divs[j].style.display='none';
    		}
            getNewNoticeList(true, 10);
    		//设置当前为高亮显示
    		this.className='navBeSelected';
    		divs[this.id].style.display='block';
    	}
    }
};






        
             



