var loading = false;

$(window).scroll(function(){
    var totalheight = parseFloat($(window).height()) + parseFloat($(window).scrollTop());
    if ($(document).height() <= totalheight)
    {
        getNewNoticeList(false, 10);
    }
});
    
