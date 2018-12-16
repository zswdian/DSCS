function Tab(num) {
    document.getElementById('right-content').style.display = "block";
    var i;
    for (i = 1; i < 5; i++) {
        if (i == num) {
            document.getElementById("icon" + i).style.display = "block";
            /*document.getElementById("close").style.display="block";*/
          ;
        } else {
            document.getElementById("icon" + i).style.display = "none";
            // document.getElementById("close").style.display="none";
        }



    }
}
$('.IconManage').click(function () {
    var flag = $('.mapright').is(":hidden");
    if (flag) {
        $('.mapright').show();
    } else {
        $('.mapright').hide();
    }

});
$('.close').click(function () {
    $('.mapright').hide();
})
$('.add').click(function () {
    $(this).addClass("active").siblings().removeClass("active");
})