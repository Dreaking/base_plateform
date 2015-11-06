function email_check(){
    var emails = document.myform.email.value; 
    var reg=/\s/;
    if((!emails=="")&&(!(/^[\da-zA-Z]+(_|)[\da-zA-Z]+@[\da-zA-Z]+.[a-z]+$/.test(emails))||!(reg.exec(emails)==null)))
    { 
        document.getElementById('email_id').innerHTML="请填写正确的邮箱并且不能有空格";
        return false;
    }else{
        document.getElementById('email_id').innerHTML="";
        i=1;
        return true; 
        }
}

function number_check(){
    var numbers=document.myform.number.value;
    var reg = /\s/;
    if((!numbers=='')&&(!/^\d{10}$/.test(numbers))||!(reg.exec(numbers)==null))
        { 
        document.getElementById('number_id').innerHTML="请填写正确的学号并且不能有空格";
        return false;
    }else{
        document.getElementById('number_id').innerHTML="";
        j=1;
        return true; 
        }
}

function birthday_check(){ 
    var birthdays=document.myform.birthday.value;
    var reg = /\s/;
  if( (!birthdays=="")&&(!/^(\d{4})(-)(\d{2})(-)(\d{2})$/.test(birthdays)||!(reg.exec(birthdays)==null))) 
     { 
        document.getElementById('birthday_id').innerHTML="请填写正确的生日并且不能有空格";
        return false;
    }else{
        document.getElementById('birthday_id').innerHTML="";
        k=1;
        return true; 
        }
}

function name_check(){ 
    var names=document.myform.name.value;
    var reg = /\s/;
  if(!/^[\u4e00-\u9fa5]+$/.test(names)||names.length>16||!(reg.exec(names)==null)) 
     { 
        document.getElementById('name_id').innerHTML="长度不能超过16个字符并且不能有空格";
        return false;
    }else{
        document.getElementById('name_id').innerHTML="";
        a=1;
        return true; 
        }
}

function nickname_check(){ 
    var nicknames=document.myform.nickname.value;
    var reg = /\s/;
  if(!/^[\u4E00-\u9FA5a-zA-Z0-9_]+$/.test(nicknames)||nicknames.length>16||!(reg.exec(nicknames)==null)) 
     { 
        document.getElementById('nickname_id').innerHTML="长度不能超过16个字符并且不能有空格";
        return false;
    }else{
        document.getElementById('nickname_id').innerHTML="";
        b=1;
        return true; 
        }
}

function qq_check(){ 
    var qqs = document.myform.qq.value; 
     var reg = /\s/;
   if(reg.exec(qqs)==null)
     { 
        document.getElementById('qq_id').innerHTML="";
        return true; 
    }
    else{
         document.getElementById('qq_id').innerHTML="不能存在空格";
         return false;

        }
}

window.onload = function(){
    $.ajax({
        url: '/school/major/list',
        dataType: 'json',
        data: null,
        type: 'POST',
        success: function(data){
            data = data.data;
            school_major_list = [];
            for(var i in data)
            {
                i = data[i];
                var t = {};
                t.id = i.school_id;
                t.name = i.school_name;
                t.major_list = [];
                for(var j in i.major_list)
                {
                    j = i.major_list[j];
                    t.major_list.push({'id': j.major_id, 'name': j.major_name});
                }
                school_major_list.push(t);
            }
            var academy_list = document.getElementById('academy');
            var profession_list = document.getElementById('profession');
            function clearSelectLists()
            {
                while (academy_list.children.length > 0)
                    academy_list.removeChild(academy_list.children[0]);

                while (profession_list.children.length > 0)
                    profession_list.removeChild(profession_list.children[0]);
            }
            clearSelectLists();
            for (var i in school_major_list)
            {
                i = school_major_list[i];
                var new_school_item = document.createElement('option');
                new_school_item.value = i.id;
                new_school_item.innerHTML = i.name;
                academy_list.appendChild(new_school_item);
            }
            if (school_major_list.length > 0)
            {
                for(var i in school_major_list[0].major_list)
                {
                    i = school_major_list[0].major_list[i];
                    var new_major_item = document.createElement('option');
                    new_major_item.value = i.id;
                    new_major_item.innerHTML = i.name;
                    profession_list.appendChild(new_major_item);
                }
            }
        }
    });

    $.ajax({
        url: '/user/info/get',
        data: null,
        dataType: 'json',
        type: 'GET',
        success: function(data){
            if (data.status != 200)
                return;
            data = data.data;
            if (data.name != null)
                document.myform.name.value = data.name;
            if (data.nickname != null)
                document.myform.nickname.value = data.nickname;
            if (data.sid != null)
                document.myform.number.value = data.sid;
            if (data.qq != null)
                document.myform.qq.value = data.qq;
            if (data.email != null)
                document.myform.email.value = data.email;
            if (data.is_male)
                document.myform.sex.value = 0;
            else
                document.myform.sex.value = 1;
        }
    });
};

document.getElementById('academy').onchange = function(){
    var value = document.getElementById('academy').value;
    for(var i in school_major_list)
    {
        i = school_major_list[i];
        if (i.id == value)
        {
            var profession_list = document.getElementById('profession');
            while (profession_list.children.length > 0)
                    profession_list.removeChild(profession_list.children[0]);
            for(var j in i.major_list)
            {
                j = i.major_list[j];
                var new_major_item = document.createElement('option');
                new_major_item.value = j.id;
                new_major_item.innerHTML = j.name;
                profession_list.appendChild(new_major_item);
            }
        }
    }
};

function submit()
{
    if(!(email_check() && number_check() && birthday_check() && name_check() &&
        nickname_check() && qq_check()))
        return;
    var data = {};
    data.name = document.myform.name.value;
    data.nickname = document.myform.nickname.value;
    data.school_id = document.getElementById('academy').value;
    data.major_id = document.getElementById('profession').value;

    if (document.myform.qq.value != '')
        data.qq = document.myform.qq.value;
    if (document.myform.sex.value == 0)
        data.is_male = 1;
    else
        data.is_male = 0;
    if(document.myform.number.value != '')
        data.sid = document.myform.number.value;

    if (document.myform.email.value != '')
        data.email = document.myform.email.value;

    console.log(JSON.stringify(data));

    $.ajax({
        url: '/user/info/set',
        data: data,
        dataType: 'json',
        type: 'POST',
        success: function(data){
            console.log(JSON.stringify(data));
            switch (data.status)
            {
                case 200:
                    history.back()
            }
        }
    });
}