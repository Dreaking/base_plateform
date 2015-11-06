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
            var section_list = document.getElementById('postPlate');
            data = data.data;
            $.each(data, function(){
                var option_tag = document.createElement('option');
                option_tag.innerHTML = this.section_name;
                option_tag.value = this.section_id;
                section_list.appendChild(option_tag);
            });
        }
    });
}

function checkTitle()
{
    var title = $.trim(document.getElementById('postTitle').value);
    document.getElementById('postTitle').value = title;
    if(title.length == 0)
    {
        document.getElementById('verify_code_text').innerHTML = "标题不能为空";
        return false;
    }
    document.getElementById('verify_code_text').innerHTML = "";
    return true;
}

window.onload=function(){
    getSectionList();
};

$('#postTitle').blur(checkTitle);

$('#confirm_post').click(function (){
    if(!checkTitle())
        return;

    var data = {};
    data.section_id = document.getElementById('postPlate').value;
    data.title = $.trim(document.getElementById('postTitle').value);
    data.content = document.myform.content.value;
    $.ajax({
        url: '/community/post/add',
        data: data,
        dataType: 'json',
        type: 'POST',
        success: function(data){
            if(data.status != 200)
            {
                return;
            }
            data = data.data;
            history.back();
        }
    })
});