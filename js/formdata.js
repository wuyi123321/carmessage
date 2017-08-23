
//时间格式化
Date.prototype.format = function(fmt) {
    var o = {
        "M+" : this.getMonth()+1,                 //月份
        "d+" : this.getDate(),                    //日
        "h+" : this.getHours(),                   //小时
        "m+" : this.getMinutes(),                 //分
        "s+" : this.getSeconds(),                 //秒
        "q+" : Math.floor((this.getMonth()+3)/3), //季度
        "S"  : this.getMilliseconds()             //毫秒
    };
    if(/(y+)/.test(fmt)) {
        fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
    }
    for(var k in o) {
        if(new RegExp("("+ k +")").test(fmt)){
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
        }
    }
    return fmt;
}
//本地资源暂存服务器
function getFileUrl(inputid,i) {
    console.log(document.getElementById(inputid).files[i]);
    var url;
    if (navigator.userAgent.indexOf("MSIE")>=1) { // IE
        url = document.getElementById("inputfile").value;
    } else if(navigator.userAgent.indexOf("Firefox")>0) { // Firefox
        url = window.URL.createObjectURL(document.getElementById(inputid).files.item(i));
    } else if(navigator.userAgent.indexOf("Chrome")>0) { // Chrome
        url = window.URL.createObjectURL(document.getElementById(inputid).files.item(i));
    }else {
        url = window.webkitURL.createObjectURL(document.getElementById(inputid).files[i]);
    }
    return url;
}
//获取url的参数
(function ($) {
    $.getUrlParam = function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return decodeURI(r[2]);  return null;
    }
})(jQuery);

//获取页面信息
var token=$.getUrlParam('token');
var FD_PLATENUMBER = $.getUrlParam('FD_PLATENUMBER');
var FD_NAME = $.getUrlParam('FD_NAME');
var FD_PHONE = $.getUrlParam('FD_PHONE');
var FD_POST = $.getUrlParam('FD_POST');
var FD_DEPT = $.getUrlParam('FD_DEPT');
var FD_AREA = $.getUrlParam('FD_AREA');
var arryall=[];
var imgsrcs=new Array();
var stas=[];
var flag =0;
var files = new Array()
var a= new Vue({
    el: '#app',
    data: function() {
        return {
            FD_PLATENUMBER:FD_PLATENUMBER,
            FD_NAME:FD_NAME,
            FD_POST:FD_POST,
            FD_DEPT:FD_DEPT,
            FD_PHONE: FD_PHONE,
            data:new Date(),
            time: new Date(),
            visible: false,
            showfile: false,
            showImage: false,
            fileUrl:[],
            cityshow:false,
            eara:'粤',
            number:'',
            wttypes: [{
                value:0,
                label:'占用专用车位'
            }, {
                value:1,
                label:'占用消防通道'
            }, {
                value:2,
                label:'非停车位处停车'
            }, {
                value:3,
                label:'车辆未在18：00移出篮球场'
            },{
                value:4,
                label:'持篮球场通行证车辆占用园内车位'
            },{
                value:5,
                label:'其他'
            }
            ],
            wdtype:'',
            wtaddresses: [{
                value: '石龙子总部'
            }, {
                value: '光明新区'
            }, {
                value: '惠州产业园'
            }],
            citydData: [{
                one: '粤',
                two: '京',
                three: '湘',
                four:'黑',
                five: '吉',
                six:'辽',
            }, {
                one: '津',
                two: '鄂',
                three: '沪',
                four:'渝 ',
                five: '琼',
                six:'冀',
            },{
                one: '晋',
                two: '贵',
                three: '陕',
                four:'滇',
                five: '甘',
                six:'苏 ',
            },{
                one: '豫',
                two: '新',
                three: '港',
                four:'澳',
                five: '吉',
                six:'宁 ',
            },{
                one: '青',
                two: '浙',
                three: '台',
                four:'皖',
                five: '藏',
                six:'闽',
            },{
                one: '内',
                two: '赣',
                three: '桂 ',
                four:'鲁',

            }
            ],
            wtaddress:'',
            remark:'',
            options4: [],
            list: [],
            loading: false,
            states: [],
        };
    },
    methods: {
        remoteMethod:function(query){
            var  avue = this;
            if (query !== ' '){
                this.loading = true;
                setTimeout(function(){
                    avue.loading = false;
                    avue.options4 = avue.list.filter(function(item) {
                        return item.label.toLowerCase()
                            .indexOf(query.toLowerCase()) > -1;
                    });
                }, 200);
            } else {
                avue.options4 = [];
            }
        },
//选择车牌号城市
        selectCity:function(row, column, cell, event){
            var aa=this;
            this.FD_PLATENUMBER='';
            this.FD_NAME='';
            this.FD_POST='';
            this.FD_DEPT='';
            this.FD_PHONE='';
            console.log(event.target.innerText)
            $("#butt").html(event.target.innerText);
            this.cityshow=false;
            $.ajax({
                type:"post",
                url:"http://appinter.sunwoda.com/ekp/ekpVehicleInfoDetail.json",
                dataType:"json",
                data: {"token":token,"plateNumber":event.target.innerText},
                success:function(data){
                    console.log(data);
                    var aas=[];
                    data=data.dataInfo.listData;
                    for(var i=0; i<data.length;i++){
                        aas.push(data[i].FD_PLATENUMBER);
                    }
                    aa.states=aas;
                    aa.list = aa.states.map(function(item ) {
                        return { value: item, label: item };
                    });
                }
            });
        },
        //根据车牌号返回对应车主信息
        getmessage:function(){
            if( this.FD_PLATENUMBER==''){
                this.FD_NAME='';
                this.FD_POST='';
                this.FD_DEPT='';
                this.FD_PHONE='';
            }else {
                var vee=this;
                $.ajax({
                    type:"post",
                    url:"http://appinter.sunwoda.com/ekp/ekpVehicleInfoDetail.json",
                    dataType:"json",
                    data: {"token":token,"plateNumber":vee.FD_PLATENUMBER},
                    success:function(data){
                        data=data.dataInfo.listData;
                        console.log(data[0]);
                        //;vee.FD_PLATENUMBER=data[0]["FD_PLATENUMBER"];
                        vee.FD_NAME=data[0]["FD_NAME"];
                        vee.FD_POST=data[0]["FD_POST"];
                        vee.FD_DEPT=data[0]["FD_DEPT"];
                        vee.FD_PHONE=data[0]["FD_PHONE"];
                    }});
            }
        },

        det:function (event) {//删除图片
            if(event.target.className=="delete"){
                flag--;
                event.target.parentNode.remove();
                var a=parseInt(event.target.getAttribute("num"));//获取点击删除图标的下标
                console.log(a);
                imgsrcs.splice(a-1,1);
                for (var i=0;i<$(".delete").length;i++){//重新赋值下标，可以接着删除
                    $(".delete")[i].setAttribute("num",i);
                }
                console.log(imgsrcs);
            }else {
                this.showImage=true;
                var file=event.target.src;
                $("#blackBg2").html("<div id='bigImg'><img src='"+file+"'/></div>");
            }
        },
        close:function(){
            this.showImage=false;
        },
        preImg:function(){

            this.visible=false;
for(var i = 0;i<document.getElementById("inputfile").files.length;i++){
    flag++;
    imgsrcs.push(document.getElementById("inputfile").files[i]);//获取表单文件往imgsrcs里加
    var src = getFileUrl("inputfile",i);
    console.log(src);
    $("#smallimages").append("<div class='cream'>"+
        "<img width='19px' height='19px' src='../weiting/images/ic_delete.png' class='delete' @click='det' num='"+flag+"'>"+
        "<img class='smallimg' width='80px' height='80px' src='"+src+"'> </div>");
}
            console.log(imgsrcs);
        },
        preImg1:function(){
            this.visible=false;
            for(var i = 0;i<document.getElementById("inputfile1").files.length;i++){
                flag++;
                imgsrcs.push(document.getElementById("inputfile1").files[i]);//获取表单文件往imgsrcs里加
                var src = getFileUrl("inputfile1",i);
                console.log(src);
                $("#smallimages").append("<div class='cream'>"+
                    "<img width='19px' height='19px' src='../weiting/images/ic_delete.png' class='delete' @click='det' num='"+flag+"'>"+
                    "<img class='smallimg' width='80px' height='80px' src='"+src+"'> </div>");
            }
            console.log(imgsrcs);
        },
    }
});
//页面加载完成请求参数
$.ajax({
    type:"post",
    url:"http://appinter.sunwoda.com/ekp/ekpVehicleInfoDetail.json",
    dataType:"json",
    data: {"token":token,"plateNumber":"粤"},
    success:function(data){
        data=data.dataInfo.listData;
        for(var i=0; i<data.length;i++){
            arryall=arryall.concat(data[i].FD_PLATENUMBER);
        }
        stas=arryall;
        a.states=stas;
        a.list = a.states.map(function(item ){
            return { value: item, label: item };
        });
    }
});
var submit;
var phone = a.FD_PHONE.split("/")[0];
var datetime =a.data.format("yyyy-MM-dd")+" "+a.time.format("hh:mm:ss");
$("#revot").on("click",function () {
    $("#blackBg3").css("display","none");
    submit.abort();
});
$("#tijiao").bind('click',0,function(){
    console.log(imgsrcs);

    // 提交判断
     if(a.FD_PLATENUMBER=="" ||a.FD_PLATENUMBER==undefined || a.time==null
         ||a.time==undefined || a.FD_PLATENUMBER==null || a.wtaddress=="" || a.wdtype=="" || imgsrcs.length==0){
         alert("请填写完整信息");
    }else {
        //送给后台数据封装
         $("#blackBg3").css("display","block");
    var formData = new FormData();
    for(var k in imgsrcs){ //文件数组
             formData.append('files',imgsrcs[k]);
        }
    formData.append('FD_PLATENUMBER',a.FD_PLATENUMBER);
    formData.append('FD_NAME',a.FD_NAME);
    formData.append('FD_POST',a.FD_POST);
    formData.append('FD_DEPT',a.FD_DEPT);
    formData.append('FD_TYPE',a.wdtype);
    formData.append('FD_ARER',a.wtaddress);
    formData.append('FD_OTHER',a.remark);
    formData.append('FD_PHONE',a.FD_PHONE);
    formData.append('token',token);
    formData.append('FD_VIOLATIONDATE',datetime);

      submit=  $.ajax({
            url: "http://appinter.sunwoda.com/ekp/ekpContentVehicle.json",
            type: "post",
            data:formData,
            cache: false,
            contentType: false,
            processData:false,
            mimeType:"multipart/form-data",
            success: function(dae) {
                console.log(dae);
                var obj = JSON.parse(dae);
                if(obj["statusCode"]==0){
                    $("#blackBg3").css("display","none");
                    alert(obj["message"]);
                    a.FD_PLATENUMBER='';
                    a.FD_NAME='';
                    a.FD_POST='';
                    a.FD_DEPT='';
                    imgsrcs=[];
                    flag=0;
                    $("#smallimages").html("");
                    $.ajax({
                        type:"post",
                        url:"http://appinter.sunwoda.com/ekp/sendVehicleNotice.json",
                        dataType:"json",
                        data: {"FD_PHONE":phone,
                            "message":datetime
                        },
                        success:function(data){
                            a.FD_PHONE='';
                            console.log(data);

                        }});
                }else {
                    alert(obj["message"]);
                }
            },
          error:function () {
              $("#blackBg3").css("display","none");
              alert("错误请求");
          }
        })
  }

});




