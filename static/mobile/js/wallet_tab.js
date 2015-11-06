var list_name = 'team_list';
var recruit_list = [];

function appendListItem(data)
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
    var a_tag = document.createElement('a');
    var li_tag = document.createElement('li');
    var title_tag = document.createElement('span');
    var team_tag = document.createElement('span');
    team_tag.innerHTML = data.team_name + '<time>' + time_str + '</time>';
    title_tag.innerHTML = data.recruit_title;
    title_tag.className = 'recruitmentTitle';
    team_tag.className = 'recruitmentTeam';
    a_tag.href = 'base_teamRecruitment.html?recruit_id=' + data.recruit_id;
    a_tag.appendChild(title_tag);
    a_tag.appendChild(team_tag);
    li_tag.appendChild(a_tag);
    document.getElementById('recruit_list').appendChild(li_tag);
    recruit_list.push(data);
}

var is_loading = false;
function getRecruitList(is_refresh, recruit_count)
{
    if(!is_loading)
        is_loading = true;
    var data = {};
    if(is_refresh)
    {
        data.is_refresh = 1;
        var list = document.getElementById('recruit_list');
        while(list.children.length > 0)
            list.removeChild(list.children[0]);
        recruit_list = [];
    }
    else
    {
        data.is_refresh = 0;
        if(recruit_list.length == 0)
            return;
        else
            data.last_recruit_id = recruit_list[recruit_list.length - 1].recruit_id;
    }
    data.notice_count = 10;
    var url = '/base/recruit/list';

    $.ajax({
        url: url,
        data: data,
        dataType: 'json',
        type: "POST",
        success: function(data){
            if (data.status != 200)
            {
                console.log(data.status);
                is_loading = false;
                return;
            }
            data = data.data;
            $.each(data, function(){
                appendListItem(this);
            });
            is_loading = false;
        },
        error: function(){
            is_loading = false;
        }
    });
}

function showTeamList()
{
    var list = document.getElementById('team_list');
    while(list.children.length > 0)
        list.removeChild(list.children[0]);
    $.ajax({
        url: '/base/team/list',
        dataType: 'json',
        data: null,
        type: 'POST',
        success: function(data){
            if(data.status != 200)
            {
                console.log(data.status);
                return;
            }
            data = data.data;
            $.each(data, function(){
                var team_tag = document.createElement('span'),
                    school_tag = document.createElement('span'),
                    a_tag = document.createElement('a'),
                    li_tag = document.createElement('li');

                team_tag.className = 'teamName';
                team_tag.innerHTML = this.team_name;
                school_tag.className = 'teamAcademy';
                school_tag.innerHTML = this.school_name;
                a_tag.href = 'teamIntroduce.html' + "?team_id=" + this.team_id;
                a_tag.appendChild(team_tag);
                a_tag.appendChild(school_tag);
                li_tag.appendChild(a_tag);
                document.getElementById('team_list').appendChild(li_tag);
            });
        }
    });
}

function showRecruitList()
{
    getRecruitList(true, 10);
}

function showBaseDescription()
{
    $.ajax({
        url: '/base/description/get',
        dataType: 'json',
        data: null,
        type: 'POST',
        success: function(data){
            if(data.status != 200)
            {
                console.log(data.status);
                return;
            }
            data = data.data;
            document.getElementById('base_description').innerHTML = data.content;
        }
    });
    $.ajax({
        url: '/base/logo/get',
        dataType: 'json',
        data: null,
        type: 'GET',
        success: function(data){
            if(data.status != 200)
            {
                console.log(data.status);
                return;
            }
            data = data.data;
            if(data.content)
                document.getElementById('base_logo').src = 'data:image/png;base64,' +
                    data.content;
            else
                document.getElementById('base_logo').src = '/static/default_base_logo.jpg';
        }
    });
}

function displaySelectedView()
{
    if(list_name == 'team_list')
        showTeamList();
    else if(list_name == 'recruit_list')
        showRecruitList();
    else
        showBaseDescription();
}

window.onload=function(){
    //tab选项切换功能
	//获取鼠标点击的表情和要切换内容的元素
    var titles=document.getElementById('navTab').getElementsByTagName('li'),
        divs=document.getElementById('tabSection').getElementsByTagName('section');
    if(titles.length!=divs.length)
    	return;
    //displaySelectedView();
    for(var i=0;i<titles.length;i++)
    {
    	titles[i].id=i;
    	titles[i].onclick=function(){
            if(this.id == 0)
                list_name = 'team_list';
            else if(this.id == 1)
                list_name = 'recruit_list';
            else
                list_name = 'base_desc';
            //清楚所有li上的class
    		for(var j=0;j<titles.length;j++){
             titles[j].className='';
             divs[j].style.display='none';
    		}
            //displaySelectedView();
    		//设置当前为高亮显示
    		this.className='navBeSelected';
    		divs[this.id].style.display='block';
    	}
    }
};






        
             



