var loading = false;
var flow_list = [];

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

    var time_tag = document.createElement('time');
    var amount_tag = document.createElement('span');
    var reason_tag = document.createElement('span');
    var operator_tag = document.createElement('span');
    var li_tag = document.createElement('li');
    amount_tag.className = 'consumingMoney';
    reason_tag.className = 'consumingReason';
    operator_tag.className = 'consumingPeople';
    time_tag.innerHTML = time_str;
    reason_tag.innerHTML = data.description;
    if(data.amount >= 0)
        amount_tag.innerHTML = '收入:' + data.amount;
    else
        amount_tag.innerHTML = '支出:' + data.amount;
    operator_tag.innerHTML = data.operator_name;

    li_tag.appendChild(amount_tag);
    li_tag.appendChild(reason_tag);
    li_tag.appendChild(operator_tag);
    li_tag.appendChild(time_tag);
    document.getElementById('flow_list').appendChild(li_tag);
}

function getNewFlowList(is_refresh, flow_count)
{
    if(loading)
        return;
    loading = true;
    var data = {};
    if (is_refresh)
    {
        data.is_refresh = 1;
        flow_list = [];
        var list = document.getElementById('flow_list');
        while (list.children.length > 0)
            list.removeChild(list.children[0]);
    }
    else {
        data.is_refresh = 0;
        if (flow_list.length == 0)
            return;
        else
            data.last_flow_id = flow_list[flow_list.length - 1].flow_id;
    }
    data.flow_count = flow_count;

    $.ajax({
        url: '/user/team/flow/list',
        data: data,
        dataType: 'json',
        type: 'POST',
        success: function (data) {

            if (data.status != 200) {
                console.log(data.status);
                loading = false;
                return;
            }
            data = data.data;
            $.each(data, function (){
                appendFlowItem(this);
            });
            loading = false;
        }
    });
}

window.onload = function(){
    getNewFlowList(true, 100000);
};