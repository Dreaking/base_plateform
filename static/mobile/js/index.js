window.onload=function()
{    
    var footerA=document.getElementById('footer').getElementsByTagName('a'),
        iframe=document.getElementById('iframe');
    for(var i=0;i<footerA.length;i++)
    {
        footerA[i].id=i;
        footerA[i].onclick=function()
        {
            //清楚所有li上的class
            for(var j=0;j<footerA.length;j++)
            {
                footerA[j].className='';
            }
            //设置当前为高亮显示
            this.className='beSelected';
            switch(this.id)
            {
                case '0' :
                    iframe.src="information.html";
                    break;
                case '1' :
                    iframe.src="base.html";
                    break;
                case '2' :
                    iframe.src="community.html";
                    break;
                case '3' :
                    $.ajax({
                        type: 'GET',
                        url: '/user/is/login',
                        data: null,
                        dataType: 'json',
                        success: function(data){
                            if(data.data.is_login)
                                iframe.src = "user.html";
                            else
                                iframe.src = "load.html";
                        }
                    });
                    break;
            }
        }
    }
}