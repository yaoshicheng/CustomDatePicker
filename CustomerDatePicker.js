import React, { Component } from 'react';
import { connect } from 'dva';
import { Form } from 'antd';
import $ from "jquery";
import  * as style from './CustomerDatePicker.css';

let index = 0;
const weekName = ["星期一","星期二","星期三","星期四","星期五","星期六","星期日"];
const wId = "w";
let flag = false;
let startX = 0;let startY = 0;
const cellWidth=15;const cellHeight=30;
let startPointX = 0;let startPointY = 0;let endPointX = 0;let endPointY = 0;
let StartAreaX = null;let StartAreaY = null;let EndAreaX = null;let EndAreaY = null;
let retcLeft = "0px";let retcTop = "0px";let retcHeight = "0px";let retcWidth = "0px";
// 禁止右键，禁止文本选择
document.οncοntextmenu=function(){return false;};
document.onselectstart=function(){return false;};

const bindEvent = (dom, eventName, listener)=>{
  if(dom.attachEvent) {
    dom.attachEvent(`on${eventName}`, listener);
  } else {
    dom.addEventListener(eventName, listener);
  }
};

const jq = (id)=>document.getElementById(id);

@connect(({ loading,adsCast }) => ({
  adsCast,
  loading,
  cars:adsCast.cars,
}))
@Form.create()
class CustomerDatePicker extends Component {
  componentDidMount() {
    this.handleInit();
    this.handleClear();
  }

  handleInit = ()=>{
    // 绘制0-23小时
    for(let i = 0;i<24;i++){
      const a = document.createElement("div");
      a.className = style["date-num"];
      a.innerHTML = i;
      $("#date-num").append(a)
    }
    // 绘制7*48个格子
    for(let i = 0;i<7;i++){
      const a = document.createElement("div");
      a.className = style.line;
      for(let j = 0;j<48;j++){
        const b = document.createElement("div");
        b.className = style.cell;
        a.appendChild(b)
      }
      $("#mydiv").append(a)
    }

    const {initData} = this.props;
    const _this = this;

    // 初始化数据
    if(initData && initData.length>0){
      for(let i = 0;i<7;i++){
        const item = initData[i];
        for(let j = 0;j<48;j++){
          if(item && item.length>0 && item.indexOf(j)>-1){
            $('#mydiv').children().eq(i).children().eq(j).addClass(style.active)
          }
        }
      }
    }
    const mydiv = document.getElementById('mydiv');
    bindEvent(mydiv, 'mousedown', (e)=>{
      flag = true;
      $("#tooltipBox").remove();
      try{
        const evt = window.event || e;
        const tmp = mydiv.getBoundingClientRect();

        const scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
        const scrollLeft = document.body.scrollLeft || document.documentElement.scrollLeft;
        startX = evt.clientX + scrollLeft;
        startY = evt.clientY + scrollTop;
        startPointX = startX-scrollLeft-tmp.left;
        startPointY = startY-scrollTop-tmp.top;
        index++;
        const div = document.createElement("div");
        div.id = wId + index;
        // div.className = "tmpDiv";
        div.style.position = "absolute";
        div.style.left = `${startX}px`;
        div.style.top = `${startY}px`;
        div.style.border = "1px dashed #009CFF";
        document.body.appendChild(div);
      }catch(e){
        throw new Error(e)
      }
    });

    const customContainer = document.getElementById('customContainer');
    bindEvent(customContainer, 'mouseout', ()=>{
      if($("#tooltipBox")){
        $("#tooltipBox").remove();
      }
    });

    bindEvent(mydiv, 'mousemove', (e)=>{
      $("#tooltipBox").remove();
      const tmp = mydiv.getBoundingClientRect();
      const evt = window.event || e;
      if(flag){
        try{
          const scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
          const scrollLeft = document.body.scrollLeft || document.documentElement.scrollLeft;
          retcLeft = `${(startX - evt.clientX - scrollLeft > 0 ? evt.clientX + scrollLeft : startX)}px`;
          retcTop = `${(startY - evt.clientY - scrollTop > 0 ? evt.clientY + scrollTop : startY)}px`;
          retcHeight = `${Math.abs(startY - evt.clientY - scrollTop)}px`;
          retcWidth = `${Math.abs(startX - evt.clientX - scrollLeft)}px`;
          endPointX = evt.clientX  - tmp.left;
          endPointY = evt.clientY  - tmp.top;
          if(jq(wId + index)){
            jq(wId + index).style.left = retcLeft;
            jq(wId + index).style.top = retcTop;
            jq(wId + index).style.width = retcWidth;
            jq(wId + index).style.height = retcHeight;
          }
        }catch(e){
          throw new Error(e)
        }
      }
      else{
        const scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
        const scrollLeft = document.body.scrollLeft || document.documentElement.scrollLeft;
        const tmpX = evt.clientX + scrollLeft;
        const tmpY = evt.clientY + scrollTop;
        endPointX = evt.clientX  - tmp.left;
        endPointY = evt.clientY  - tmp.top;
        let indexX = null;
        let indexY = null;
        // 获取鼠标悬浮的X,Y坐标
        for(let i = 0;i<48;i++){
          if(endPointX<i*cellWidth){
            indexX = i;
            break;
          }
        }
        for(let j = 0;j<8;j++){
          if(endPointY<j*cellHeight){
            indexY = j;
            break;
          }
        }
        const yName = weekName[indexY-1];
        const aa = Math.floor(indexX / 2);
        const bb = indexX % 2;
        const xName = bb===0?(`${aa}:00 - ${aa}:30`):(`${aa}:30 - ${(aa+1)}:00`);
        const div = document.createElement("div");
        div.id = "tooltipBox";
        div.innerHTML = `${yName}${xName}`;
        div.style.position = "absolute";
        div.style.left = `${tmpX+10}px`;
        div.style.top =  `${tmpY+10}px`;
        div.style.padding = "5px";
        div.style.border = "1px solid #aaa";
        div.style.background = "#fff";
        document.body.appendChild(div);
      }
    });

    document.onmouseup = ()=>{
      flag = false;
      if(jq(wId + index)){
        document.body.removeChild(jq(wId + index));
      }
      if(startPointX ===0 && startPointY === 0) return;
      if(endPointX ===0 && endPointY ===0 ){
        for(let i = 1;i<49;i++){
          if(startPointX<i*cellWidth){
            StartAreaX = i;
            break;
          }
        }
        for(let j = 1;j<8;j++){
          if(startPointY<j*cellHeight){
            StartAreaY = j;
            break;
          }
        }
        $('#mydiv').children().eq(StartAreaY-1).children().eq(StartAreaX-1).toggleClass(style.active);
        this.handleChangeDatePeriod();
        this.handleClearDefaultValue();
        return
      }
      try{
        if( startPointX && startPointY && endPointX && endPointY){
          for(let i = 1;i<49;i++){
            if(!StartAreaX && startPointX<i*cellWidth){
              StartAreaX = i;
            }
            if(!EndAreaX && endPointX<i*cellWidth){
              EndAreaX = i;
            }
          }
          for(let j = 1;j<8;j++){
            if( !StartAreaY&& startPointY<j*cellHeight){
              StartAreaY = j;
            }
            if( !EndAreaY&& endPointY<j*cellHeight){
              EndAreaY = j;
            }
          }
          const tmpX1 = Math.min(StartAreaX,EndAreaX);
          const tmpX2 = Math.max(StartAreaX,EndAreaX);
          const tmpY1 = Math.min(StartAreaY,EndAreaY);
          const tmpY2 = Math.max(StartAreaY,EndAreaY);
          for(let m = tmpX1-1;m<tmpX2;m++){
            for(let n = tmpY1-1;n<tmpY2;n++){
              $('#mydiv').children().eq(n).children().eq(m).toggleClass(style.active)
            }
          }
          this.handleChangeDatePeriod();
          this.handleClearDefaultValue();
        }
      }catch(e){
        throw new Error(e)
      }
    }
  };

  handleChangeDatePeriod =()=>{
    const {changeWeekPeriod} = this.props;
    const weekdays = {
      "monday": [],
      "tuesday": [],
      "wednesday": [],
      "thursday": [],
      "friday": [],
      "saturday": [],
      "sunday": []
    };
    for(let m = 0;m<8;m++){
      for(let n = 0;n<48;n++){
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
    if(changeWeekPeriod) {
      changeWeekPeriod(weekdays)
    }
  };

  handleClearDefaultValue=()=>{
    startPointX = 0;startPointY = 0;endPointX = 0;endPointY = 0;
    StartAreaX = null;StartAreaY = null;EndAreaX = null;EndAreaY = null;
  };

  handleClear=()=>{
    const {changeWeekPeriod} = this.props;
    $("#date-clear-btn").on('click',()=>{
      for(let i = 0;i<7;i++){
        for(let j = 0;j<48;j++){
          $('#mydiv').children().eq(i).children().eq(j).removeClass(style.active)
        }
      }
      if(changeWeekPeriod) changeWeekPeriod(null)
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

