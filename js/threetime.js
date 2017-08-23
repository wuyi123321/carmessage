$(document).ready(function(){
    var music="";
    var pageNo=1;
    var local = "http://appinter.sunwoda.com/ekp/ekpVehicleInfoDetail.json";
    token = GetQueryString("token");
    var fn=function(data){
        console.log(data);
        if(data.dataInfo != null){
            data=data.dataInfo.listData;
            console.log(data);
            //i表示在data中的索引位置，n表示包含的信息的对象
            $.each(data,function(i,n){
                //获取对象中属性为optionsValue的值
                var dA=n["FD_POST"];
                if(dA.length>5){
                    dA=dA.substring(-1,5)+"...";
                }else{
                    dA=dA;
                }
                var dB=n["FD_DEPT"];
                if(dB.length>5){
                    dB=dB.substring(-1,5)+"...";
                }else {
                    dB=dB;
                }
                var imgsrc;
                if(!n["FD_PHONE"]){
                    imgsrc="../images/nocall.png";
                    if(n["FD_COUNT"]>=3){
                        music+="<tr ><td td width='60px' style='background: #ff8'><a href='tel:"+n["FD_PHONE"]+"'><img src='"+imgsrc+"'></a>" +
                            "</td><td width='80px' style='background: #ff8' class='aa b1' id="+i+">"+n["FD_NAME"].substring(-1,3)+"</td>"+
                            "<td class='aa b2' style='background: #ff8' id="+i+">"+n["FD_PLATENUMBER"]+"</td>"+
                            "<td class='aa b3' style='background: #ff8' id="+i+">"+dB+"</td></tr>";
                    }
                }else {
                    imgsrc="images/call.png";
                    if(n["FD_COUNT"]>=3){
                        music+="<tr ><td td width='60px'style='background: #ff8'><a href='tel:"+n["FD_PHONE"]+"'><img src='"+imgsrc+"'></a>" +
                            "</td><td width='80px' class='aa b1'  style='background: #ff8' id="+i+">"+n["FD_NAME"].substring(-1,3)+"</td>"+
                            "<td class='aa b2' style='background: #ff8' id="+i+">"+n["FD_PLATENUMBER"]+"</td>"+
                            "<td class='aa b3' style='background: #ff8' id="+i+">"+dB+"</td></tr>";
                    }
                }
            });
            $('#bod').append("<table >"+music+"</table>");
            $(".aa").bind('click',[1],function(){
                $("#bod").css("position","fixed");
                $("#blackBg").css("display","block");
                var j=this.getAttribute("id");
                message="<tr><td class='one'>姓名</td>"
                    + "<td>"+data[j]["FD_NAME"]+"</td></tr>"
                    + "<td class='one'>手机</td>"
                    + "<td><a href='tel:"+data[j]['FD_PHONE']+"'>"+data[j]["FD_PHONE"]+"</td></a></tr>"
                    + "<td class='one'>车牌</td>"
                    + "<td>"+data[j]["FD_PLATENUMBER"]+"</td></a></tr>"
                    + "<td class='one'>职位</td>"
                    + "<td>"+data[j]["FD_POST"]+"</td></tr>"
                    + "<td class='one'>违停次数</td>"
                    + "<td>"+data[j]["FD_COUNT"]+"</td></tr>"
                    + "<td class='one'>所在部门</td>"
                    + "<td>"+data[j]["FD_DEPT"]+"</td></tr>"
                    + "<td class='one'>申请区域</td>"
                    + "<td>"+data[j]["FD_AREA"]+"</td></tr>"

                $("#content").html("<table>"+message+"</table>"+ "<div id='weitingdengji'>" +
                    "<a href='from.html?FD_PLATENUMBER="+data[j]["FD_PLATENUMBER"]+
                    "&FD_NAME="+data[j]["FD_NAME"]+
                    "&FD_PHONE="+data[j]["FD_PHONE"]+
                    "&FD_POST="+data[j]["FD_POST"]+
                    "&token="+token+
                    "&FD_DEPT="+data[j]["FD_DEPT"]+
                    "&FD_AREA="+data[j]["FD_AREA"]+
                    "'>违停登记</a><a href='message.html?token="+token+"&plateNumber="+data[j]["FD_PLATENUMBER"]+"'>违停详情</a></div>");

                for(var i=0;i<$("#content table tr td").length;i++){
                    if( $("#content table tr td").init()[i].innerHTML=="undefined"){
                        $("#content table tr td").init()[i].innerHTML="";
                    }
                }

                for(var i=0;i<$("#content a").length;i++){
                    if( $("#content a").init()[i].innerHTML=="undefined"){
                        $("#content a").init()[i].innerHTML="";
                    }
                }
            });
            $("#close").bind('click',[1],function () {
                $("#blackBg").css("display","none")
                $("#content").empty();
                $("#bod").css("position","absolute");
            });
        }
    };
    $.ajax({
        type:"post",
        url:"http://appinter.sunwoda.com/ekp/ekpVehicleInfoDetail.json",
        dataType:"json",
        data: {"token":token},
        success:fn
    });
    $("#search input").bind('keyup',[1],function () {
        if($("#search input").val()){
            music="";
            $("#bod").html("");
            var val=$("#search input").val();
            $.ajax({
                type:"post",
                url:"http://appinter.sunwoda.com/ekp/ekpVehicleInfoDetail.json",
                 dataType:"json",
                 data: {"token":token,"plateNumber": val},//f03372282ba666526cf04fc987cc5cae"
                 success:fn
                 });
            }else {
                music="";
                $("#bod").html("");
                $.ajax({
                    type:"post",
                    url:"http://appinter.sunwoda.com/ekp/ekpVehicleInfoDetail.json",
                    dataType:"json",
                    data: { "token":token,"plateNumber":"粤" },
                    success:fn
            });
        }
    });
});
$("#weiting").bind('click',[],function () {
   window.location.href="from.html?token="+token+"";
});
$("#threeTime").bind('click',[],function () {
    window.location.href="index.html?token="+token+"";
});

function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if(r != null)
        return(r[2]);
    return null;
}
$("#chufa").on("click",function () {
    $("#black2").css("display","block");
});
$("#queding").on("click",function () {
    $("#black2").css("display","none");
});
$("#search input").bind('focus',[1],function (){
    //$("#search").css("width","90%");
    $("#search").animate({
        width:"93%"
    });
    $("#weiting").css("display","none");
    $("#chufa").css("display","none");
    $("#threeTime").css("display","none");
});
$("#search input").bind('blur',[1],function (){
    //$("#search").css("width","90%");
    $("#search").animate({
        width:"35%"
    });
    $("#weiting").css("display","block");
    $("#chufa").css("display","block");
    $("#threeTime").css("display","block");
});

function goToUrlHtml(url) {
    token = GetQueryString("token");
    location.href = url + "?token=" + token;
}