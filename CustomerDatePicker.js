import React, { Component } from 'react';
import { connect } from 'dva';
import { Form } from 'antd';
import $ from "jquery";
import  * as style from './CustomerDatePicker.css';

let index = 0;
let weekName = ["星期一","星期二","星期三","星期四","星期五","星期六","星期日"];

@connect(({ loading,adsCast }) => ({
  adsCast,
  loading,
  cars:adsCast.cars,
}))
@Form.create()
class CustomerDatePicker extends Component {

  refCb = (dom) =>{
    const {initData} = this.props;
    const _this = this;
    document.οncοntextmenu=function(){return false;};
    document.onselectstart=function(){return false;};
    const wId = "w";
    let startX = 0;
    let startY = 0;
    let flag = false;
    const cellWidth=15;
    const cellHeight=30;
    let startPointX = 0;
    let startPointY = 0;
    let endPointX = 0;
    let endPointY = 0;
    let StartAreaX = null;
    let StartAreaY = null;
    let EndAreaX = null;
    let EndAreaY = null;
    let retcLeft = "0px";
    let retcTop = "0px";
    let retcHeight = "0px";
    let retcWidth = "0px";

    let _$ = function(id){
      return document.getElementById(id);
    }

    $("#date-num").empty()
    for(var i = 0;i<24;i++){
      var a = document.createElement("div");
      a.className = style["date-num"];
      a.innerHTML = i;
      $("#date-num").append(a)
    }

    $("#mydiv").empty()
    for(var i = 0;i<7;i++){
      var a = document.createElement("div");
      a.className = style.line;

      for(var j = 0;j<48;j++){
        var b = document.createElement("div");
        b.className = style.cell;
        a.appendChild(b)
      }
      $("#mydiv").append(a)
    }
    for(var i = 0;i<7;i++){
      let item = initData[i];
      for(var j = 0;j<48;j++){
        if(item && item.length>0 && item.indexOf(j)>-1){
          $('#mydiv').children().eq(i).children().eq(j).addClass(style.active)
        }
      }
    }

    var bindEvent = function(dom, eventName, listener){
      if(dom.attachEvent) {
        dom.attachEvent('on'+eventName, listener);
      } else {
        dom.addEventListener(eventName, listener);
      }
    }
    var mydiv = document.getElementById('mydiv');

    bindEvent(mydiv, 'mousedown', function(e){
      flag = true;
      $("#tooltipBox").remove();
      try{
        var evt = window.event || e;
        var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
        var scrollLeft = document.body.scrollLeft || document.documentElement.scrollLeft;
        startX = evt.clientX + scrollLeft;
        startY = evt.clientY + scrollTop;
        var tmp = mydiv.getBoundingClientRect();

        startPointX = startX-scrollLeft-tmp.left;
        startPointY = startY-scrollTop-tmp.top;
        index++;
        var div = document.createElement("div");
        div.id = wId + index;
        div.className = "tmpDiv";
        div.style.position = "absolute";
        div.style.left = startX + "px";
        div.style.top = startY + "px";
        div.style.border = "1px dashed #009CFF";
        document.body.appendChild(div);
      }catch(e){
        //alert(e);
      }

    })
    var customContainer = document.getElementById('customContainer');
    bindEvent(customContainer, 'mouseout', function(e){
      $("#tooltipBox") && $("#tooltipBox").remove();
    })
    bindEvent(mydiv, 'mousemove', function(e){
      $("#tooltipBox").remove();
      if(flag){
        try{
          var mydiv = document.getElementById('mydiv');
          var tmp = mydiv.getBoundingClientRect();
          var evt = window.event || e;
          var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
          var scrollLeft = document.body.scrollLeft || document.documentElement.scrollLeft;
          retcLeft = (startX - evt.clientX - scrollLeft > 0 ? evt.clientX + scrollLeft : startX) + "px";
          retcTop = (startY - evt.clientY - scrollTop > 0 ? evt.clientY + scrollTop : startY) + "px";
          retcHeight = Math.abs(startY - evt.clientY - scrollTop) + "px";
          retcWidth = Math.abs(startX - evt.clientX - scrollLeft) + "px";

          endPointX = evt.clientX  - tmp.left;
          endPointY = evt.clientY  - tmp.top;
          _$(wId + index).style.left = retcLeft;
          _$(wId + index).style.top = retcTop;
          _$(wId + index).style.width = retcWidth;
          _$(wId + index).style.height = retcHeight;
        }catch(e){
          //alert(e);
        }
      }
      else{
        var mydiv = document.getElementById('mydiv');
        var tmp = mydiv.getBoundingClientRect();
        var evt = window.event || e;
        var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
        var scrollLeft = document.body.scrollLeft || document.documentElement.scrollLeft;
        // if( tmpX === evt.clientX + scrollLeft && tmpY === evt.clientY + scrollTop){
        // 	return
        // }
        var tmpX = evt.clientX + scrollLeft;
        var tmpY = evt.clientY + scrollTop;

        endPointX = evt.clientX  - tmp.left;
        endPointY = evt.clientY  - tmp.top;
        let indexX = null;
        let indexY = null;
        for(var i = 1;i<49;i++){
          if(endPointX<i*cellWidth){
            indexX = i;
            break;
          }
        }

        for(var j = 1;j<8;j++){
          if(endPointY<j*cellHeight){
            indexY = j;
            break;
          }
        }
        var yName = weekName[indexY-1];
        var aa = Math.floor((indexX-1) / 2);
        var bb = (indexX-1) % 2 ;
        var xName = bb===0?(aa+":00 - " + aa+":30"):(aa+":30 - " + (aa+1)+":00")

        var div = document.createElement("div");
        div.id = "tooltipBox";
        div.innerHTML = yName + " "+xName;
        div.style.position = "absolute";
        div.style.left = tmpX+10 + "px";
        div.style.top = tmpY+10 + "px";
        div.style.padding = "5px";
        div.style.border = "1px solid #aaa";
        div.style.background = "#fff";
        document.body.appendChild(div);
      }
    })
    document.onmouseup = function(){
      flag = false;
      $(".tmpDiv").remove();
      if(_$(wId + index)){
        document.body.removeChild(_$(wId + index));
      }
      if(startPointX ===0 && startPointY === 0){
        return
      }

      if(endPointX ===0 && endPointY ===0 ){
        for(var i = 1;i<49;i++){
          if(startPointX<i*cellWidth){
            StartAreaX = i;
            break;
          }
        }

        for(var j = 1;j<8;j++){
          if(startPointY<j*cellHeight){
            StartAreaY = j;
            break;
          }
        }
        $('#mydiv').children().eq(StartAreaY-1).children().eq(StartAreaX-1).toggleClass(style.active);

        let weekdays = {
          "monday": [],
          "tuesday": [],
          "wednesday": [],
          "thursday": [],
          "friday": [],
          "saturday": [],
          "sunday": []
        }
        for(var m = 0;m<8;m++){
          for(var n = 0;n<48;n++){
            if($('#mydiv').children().eq(m).children().eq(n).hasClass(style.active)){
              switch(m){
                case 0:
                  weekdays["monday"].push(n);
                  break;
                case 1:
                  weekdays["tuesday"].push(n);
                  break;
                case 2:
                  weekdays["wednesday"].push(n);
                  break;
                case 3:
                  weekdays["thursday"].push(n);
                  break;
                case 4:
                  weekdays["friday"].push(n);
                  break;
                case 5:
                  weekdays["saturday"].push(n);
                  break;
                case 6:
                  weekdays["sunday"].push(n);
                  break;
                default:
                  break;
              }
            }
          }
        }

        if(_this.props.changeWeekPeriod)
        {
          _this.props.changeWeekPeriod(weekdays)
        }
        startPointX = 0;startPointY = 0;
        endPointX = 0;endPointY = 0;
        StartAreaX = null;
        StartAreaY = null;
        EndAreaX = null;
        EndAreaY = null;
        return
      }
      try{
        if( startPointX && startPointY && endPointX && endPointY){
          for(var i = 1;i<49;i++){
            if(startPointX<i*cellWidth){
              StartAreaX = i;
              break;
            }
          }

          for(var j = 1;j<8;j++){
            if(startPointY<j*cellHeight){
              StartAreaY = j;
              break;
            }
          }

          for(var i = 1;i<49;i++){
            if(endPointX<i*cellWidth){
              EndAreaX = i;
              break;
            }
          }

          for(var j = 1;j<8;j++){
            if(endPointY<j*cellHeight){
              EndAreaY = j;
              break;
            }
          }
          var tmpX1 = Math.min(StartAreaX,EndAreaX);
          var tmpX2 = Math.max(StartAreaX,EndAreaX);
          var tmpY1 = Math.min(StartAreaY,EndAreaY);
          var tmpY2 = Math.max(StartAreaY,EndAreaY);

          for(var m = tmpX1-1;m<tmpX2;m++){
            for(var n = tmpY1-1;n<tmpY2;n++){
              $('#mydiv').children().eq(n).children().eq(m).toggleClass(style.active)
            }
          }
          let weekdays = {
            "monday": [],
            "tuesday": [],
            "wednesday": [],
            "thursday": [],
            "friday": [],
            "saturday": [],
            "sunday": []
          }
          for(var m = 0;m<8;m++){
            for(var n = 0;n<48;n++){
              if($('#mydiv').children().eq(m).children().eq(n).hasClass(style.active)){
                switch(m){
                  case 0:
                    weekdays["monday"].push(n);
                    break;
                  case 1:
                    weekdays["tuesday"].push(n);
                    break;
                  case 2:
                    weekdays["wednesday"].push(n);
                    break;
                  case 3:
                    weekdays["thursday"].push(n);
                    break;
                  case 4:
                    weekdays["friday"].push(n);
                    break;
                  case 5:
                    weekdays["saturday"].push(n);
                    break;
                  case 6:
                    weekdays["sunday"].push(n);
                    break;
                  default:
                    break;
                }
              }
            }
          }

          if(_this.props.changeWeekPeriod)
          {
            _this.props.changeWeekPeriod(weekdays)
          }

          startPointX = 0;startPointY = 0;
          endPointX = 0;endPointY = 0;
          StartAreaX = null;
          StartAreaY = null;
          EndAreaX = null;
          EndAreaY = null;
        }
      }catch(e){
        //alert(e);
      }
    }

    $("#date-clear-btn").on('click',function(){
      for(var i = 0;i<7;i++){
        for(var j = 0;j<48;j++){
          $('#mydiv').children().eq(i).children().eq(j).removeClass(style.active)
        }
      }
      $("#tooltipBox") && $("#tooltipBox").remove();
      if(_this.props.changeWeekPeriod)
      {
        _this.props.changeWeekPeriod(null)
      }
    });
  };

  render() {
    return (
      <div id="customContainer" className={style.container} style={{background:"#fff"}} ref={(dom)=>this.refCb(dom)}>
        <div className={style["main-table"]}>
          <div className={style["left-con"]}>
            <div className={style["date-desc"]}>星期\时间</div>
            <div className={style["date-name"]}>星期一</div>
            <div className={style["date-name"]}>星期二</div>
            <div className={style["date-name"]}>星期三</div>
            <div className={style["date-name"]}>星期四</div>
            <div className={style["date-name"]}>星期五</div>
            <div className={style["date-name"]}>星期六</div>
            <div className={style["date-name"]}>星期日</div>
          </div>
          <div className={style["right-con"]}>
            <div className={style.aa}>
              <div className={style.bb}>00:00-12:00</div>
              <div className={style.bb}>12:00-24:00</div>
            </div>

            <div id="date-num" style={{display: "flex",height: "20px"}} />
            <div className={style.mydiv} id="mydiv" />
          </div>
        </div>
        <div style={{display: "flex"}}>
          <div style={{ display: "flex", justifyContent:"flex-start",flex:"1"}}>
            <div style={{ display: "flex", justifyContent:"flex-start",alignItems: "center",height:"40px",flex: "1"}}>
              <div style={{width: "15px",height: "15px",border: "1px solid #ccc",marginLeft: "20px"}} />
              <div style={{marginLeft:"5px",marginRight:"20px"}}>未选</div>
              <div style={{width: "15px",height: "15px",border: "1px solid #eee",background: "#009CFF"}} />
              <div style={{marginLeft:"5px",marginRight:"20px"}}>已选选</div>
              <div style={{marginLeft:"5px",marginRight:"20px"}}>可拖动鼠标选择时间段</div>
            </div>
            <div id="date-clear-btn" style={{width: "80px",textAlign:"center",height: "40px",lineHeight: "40px",color: "#009CFF",cursor: "pointer"}}>
              清空
            </div>
          </div>
        </div>
      </div>
    )
  }
}
export default CustomerDatePicker

