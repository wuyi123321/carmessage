var message='';
var pnam=1;
$(document).ready(function(){
    var music="";
    var fn=function(data){
        $('#bod').empty();
        data=data.dataInfo.listData;
        //i表示在data中的索引位置，n表示包含的信息的对象
        $.each(data,function(i,n){
            //获取对象中属性为optionsValue的值
            var dA=n["txl_DptNameA"];
            if(dA.length>5){
                dA=dA.substring(-1,5)+"...";
            }
            var dB=n["txl_DptNameB"];
            if(dB.length>5){
                dB=dB.substring(-1,5)+"...";
            }
            console.log(i);
            var imgsrc;
            if(!n["txl_MobilePhone"]){
                imgsrc="../images/nocall.png";
                music+="<tr><td width='60px'><img src='"+imgsrc+"'></td><td class='aa' id="+i+">"+n["txl_EmpName"]+"</td>"+
                    "<td class='aa' id="+i+">"+dA+"</td>"+
                    "<td class='aa' id="+i+">"+dB+"</td></tr>";
            }else {
                imgsrc="../images/call.png";
                music+="<tr><td width='60px'><a href='tel:"+n["txl_MobilePhone"]+"'><img src='"+imgsrc+"'></a></td>" +
                    "<td class='aa' id="+i+">"+n["txl_EmpName"]+"</td>"+
                    "<td class='aa' id="+i+">"+dA+"</td>"+
                    "<td class='aa' id="+i+">"+dB+"</td></tr>";
            }
        });
        $('#bod').append("<table>"+music+"</table>");
        $(".aa").bind('click',[1],function(){
            $(window).unbind('scroll');
            $("#blackBg").css("display","block");
            var j=this.getAttribute("id");
            message="<tr><td id='one'>姓名</td>"
                + "<td>"+data[j]["txl_EmpName"]+"</td></tr>"
                + "<td>手机</td>"
                + "<td><a href='tel:"+data[j]['txl_MobilePhone']+"'>"+data[j]["txl_MobilePhone"]+"</td></a></tr>"
                + "<td>短号</td>"
                + "<td><a href='tel:"+data[j]['txl_Cornet']+"'>"+data[j]["txl_Cornet"]+"</td></a></tr>"
                + "<td>邮箱</td>"
                + "<td>"+data[j]["txl_EmailAddress"]+"</td></tr>"
                + "<td>一级部门</td>"
                + "<td>"+data[j]["txl_DptNameA"]+"</td></tr>"
                + "<td>二级部门</td>"
                + "<td>"+data[j]["txl_DptNameB"]+"</td></tr>"
                + "<td>工号</td>"
                + "<td>"+data[j]["txl_EmpNo"]+"</td></tr>"
                + "<td>备注</td>"
                + "<td>"+data[j]["txl_Memo"]+"</td></tr>";
            $("#content").append("<table>"+message+"</table>");

            for(var i=0;i<$("#content table tr td").length;i++){
                if( $("#content table tr td").init()[i].innerHTML=="undefined"){
                    $("#content table tr td").init()[i].innerHTML="";
                   }
                }
                if($("#content table tr td" ).length>16){
                    for(var i=16;i<$("#content table tr td" ).length;i++){
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
            $(window).bind('scroll',[1],fn1);
        });
    };
    var fn1=function() {
        message="";
        if ($(document).scrollTop() >= $(document).height() - $(window).height()) {
            pnam=pnam+1;
            music="";
            $("#bod").empty();
            console.log(pnam);
            $.ajax({
                type:"post",
                //url:"http://172.16.110.68:9000/swdAPP/ekp/ekpContactQuery.json?token=028d562ee5987baedf694766ccc35268",
                url:"music1.txt",
                dataType:"json",
                success:fn
            });
        }
    };
    $.ajax({
        type:"get",
        //url:"http://172.16.110.68:9000/swdAPP/ekp/ekpContactQuery.json?token=028d562ee5987baedf694766ccc35268",
        url:"music.txt",
        dataType:"json",
        success:fn
    });
    $(window).bind('scroll',[1],fn1);
   console.log( $("#search input"));
    $("#search input").bind('keyup',[1],function () {if($("#search input").val()){
        music="";
        $("#bod").empty();
       var val=$("#search input").val();
       console.log(val);
        $.ajax({
            type:"get",
            //url:"http://172.16.110.68:9000/swdAPP/ekp/ekpContactQuery.json?token=028d562ee5987baedf694766ccc35268",
            url:"n3.txt",
            dataType:"json",
            success:fn
        });}else {
        music="";
        $("#bod").empty();
        $.ajax({
            type:"get",
            //url:"http://172.16.110.68:9000/swdAPP/ekp/ekpContactQuery.json?token=028d562ee5987baedf694766ccc35268",
            url:"music.txt",
            dataType:"json",
            success:fn
        });
    }



    });

});

