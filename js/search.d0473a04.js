(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["search"],{"28ea":function(e,t,c){"use strict";c("a2c6")},"4e22":function(e,t,c){"use strict";c.r(t);var n=c("7a23"),r=Object(n["P"])("data-v-1473f296");Object(n["y"])("data-v-1473f296");var a={class:"search"},l={class:"search-input-wrapper"},i={class:"hot-keys"},o=Object(n["j"])("h1",{class:"title"},"热门搜索",-1),s={class:"search-history"},u={class:"title"},j=Object(n["j"])("span",{class:"text"},"搜索历史",-1),f=Object(n["j"])("i",{class:"icon-clear"},null,-1),b={class:"search-result"};Object(n["w"])();var O=r((function(e,t,c,O,d,h){var p=Object(n["D"])("search-input"),v=Object(n["D"])("confirm"),m=Object(n["D"])("search-list"),y=Object(n["D"])("scroller"),S=Object(n["D"])("suggest"),k=Object(n["D"])("router-view");return Object(n["v"])(),Object(n["h"])("div",a,[Object(n["j"])("div",l,[Object(n["j"])(p,{modelValue:O.query,"onUpdate:modelValue":t[1]||(t[1]=function(e){return O.query=e})},null,8,["modelValue"])]),Object(n["N"])(Object(n["j"])(y,{class:"search-content",ref:"scrollerRef"},{default:r((function(){return[Object(n["j"])("div",null,[Object(n["j"])("div",i,[o,Object(n["j"])("ul",null,[(Object(n["v"])(!0),Object(n["h"])(n["a"],null,Object(n["B"])(O.hotKeys,(function(e){return Object(n["v"])(),Object(n["h"])("li",{class:"item",onClick:function(t){return O.addQuery(e.key)},key:e.id},[Object(n["j"])("span",null,Object(n["H"])(e.key),1)],8,["onClick"])})),128))])]),Object(n["N"])(Object(n["j"])("div",s,[Object(n["j"])("h1",u,[j,Object(n["j"])("span",{class:"clear",onClick:t[2]||(t[2]=function(){return O.onClearClick&&O.onClearClick.apply(O,arguments)})},[f])]),Object(n["j"])(v,{ref:"confirmRef",text:"是否清空搜索历史","confirm-btn-text":"清空",onConfirm:O.clearSearchHistory},null,8,["onConfirm"]),Object(n["j"])(m,{searches:O.searchHistory,onSearchHistoryItemClick:O.addQuery,onDeleteSearchHistoryItem:O.deleteSearchHistoryItem},null,8,["searches","onSearchHistoryItemClick","onDeleteSearchHistoryItem"])],512),[[n["K"],O.searchHistory.length]])])]})),_:1},512),[[n["K"],!O.query]]),Object(n["N"])(Object(n["j"])("div",b,[Object(n["j"])(S,{query:O.query,onResultSongClick:O.onResultSongClick,onResultSingerClick:O.onResultSingerClick},null,8,["query","onResultSongClick","onResultSingerClick"])],512),[[n["K"],O.query]]),Object(n["j"])(k,null,{default:r((function(e){var t=e.Component;return[Object(n["j"])(n["d"],{appear:"",name:"slide"},{default:r((function(){return[(Object(n["v"])(),Object(n["h"])(Object(n["F"])(t),{data:O.clickedSinger},null,8,["data"]))]})),_:2},1024)]})),_:1})])})),d=c("1da1"),h=(c("ac1f"),c("5319"),c("b0c0"),c("96cf"),c("0ff1")),p=c("b98a"),v=c("9e89"),m=Object(n["P"])("data-v-53d68aa0");Object(n["y"])("data-v-53d68aa0");var y={class:"confirm"},S={class:"confirm-wrapper"},k={class:"confirm-content"},g={class:"text"},C={class:"operate"};Object(n["w"])();var w=m((function(e,t,c,r,a,l){return Object(n["v"])(),Object(n["h"])(n["c"],{to:"body"},[Object(n["j"])(n["d"],{name:"confirm-fade"},{default:m((function(){return[Object(n["N"])(Object(n["j"])("div",y,[Object(n["j"])("div",S,[Object(n["j"])("div",k,[Object(n["j"])("p",g,Object(n["H"])(c.text),1),Object(n["j"])("div",C,[Object(n["j"])("div",{class:"operate-btn left",onClick:t[1]||(t[1]=function(){return l.confirm&&l.confirm.apply(l,arguments)})},Object(n["H"])(c.confirmBtnText),1),Object(n["j"])("div",{class:"operate-btn",onClick:t[2]||(t[2]=function(){return l.cancel&&l.cancel.apply(l,arguments)})},Object(n["H"])(c.cancelBtnText),1)])])])],512),[[n["K"],a.visible]])]})),_:1})])})),R={name:"confirm",props:{text:{type:String,default:""},confirmBtnText:{type:String,default:"确定"},cancelBtnText:{type:String,default:"取消"}},data:function(){return{visible:!1}},emits:["confirm","cancel"],methods:{confirm:function(){this.hide(),this.$emit("confirm")},cancel:function(){this.hide(),this.$emit("cancel")},hide:function(){this.visible=!1},show:function(){this.visible=!0}}};c("28ea");R.render=w,R.__scopeId="data-v-53d68aa0";var H=R,x=c("9caa"),I=c("d296"),_=c("5502"),q=c("6c02"),D=c("335a"),K=c("aaef"),A=c("0d92"),B={name:"search",components:{Scroller:v["a"],SearchInput:h["a"],Suggest:p["a"],SearchList:x["a"],Confirm:H},setup:function(){var e=Object(_["e"])(),t=Object(q["c"])(),c=Object(n["A"])(""),r=Object(n["A"])([]),a=Object(n["A"])(null),l=Object(n["A"])(null),i=Object(n["A"])(null),o=Object(A["a"])(),s=o.saveSearchHistory,u=o.deleteSearchHistoryItem,j=o.clearSearchHistory;Object(I["a"])().then((function(e){r.value=e.hotKeys}));var f=Object(n["f"])((function(){return e.state.searchHistory}));function b(){l.value.scroll.refresh()}Object(n["L"])(c,function(){var e=Object(d["a"])(regeneratorRuntime.mark((function e(t){return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:if(t){e.next=4;break}return e.next=3,Object(n["p"])();case 3:b();case 4:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}());var O=function(e){c.value=e},h=function(t){console.log("onResultSongClick",t),s(c.value),e.dispatch("addSong",t)},p=function(e){console.log("onResultSongClick",e),s(c.value),a.value=e,m(e),t.push({path:"/search/".concat(e.name.replace(/ /g,"_"))})},v=function(){i.value.show()};function m(e){D["a"].session.set(K["f"],e)}return{query:c,hotKeys:r,clickedSinger:a,searchHistory:f,scrollerRef:l,confirmRef:i,addQuery:O,clearSearchHistory:j,onResultSongClick:h,onResultSingerClick:p,onClearClick:v,deleteSearchHistoryItem:u}}};c("fdab");B.render=O,B.__scopeId="data-v-1473f296";t["default"]=B},"8f03":function(e,t,c){},"9e89":function(e,t,c){"use strict";var n=c("1da1"),r=(c("96cf"),c("1d73")),a=c("7a23"),l=c("5502");t["a"]={name:"wrap-scroller",props:r["a"].props,emits:r["a"].emits,render:function(e){return Object(a["m"])(r["a"],Object(a["o"])({ref:"scrollerRef"},e.$props,{onScroll:function(t){e.$emit("scroll",t)}}),{default:Object(a["M"])((function(){return[Object(a["C"])(e.$slots,"default")]}))})},setup:function(){var e=Object(a["A"])(null),t=Object(a["f"])((function(){return e.value.scroll})),c=Object(l["e"])(),r=Object(a["f"])((function(){return c.state.playlist}));return Object(a["L"])(r,Object(n["a"])(regeneratorRuntime.mark((function t(){return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.next=2,Object(a["p"])();case 2:e.value.scroll.refresh();case 3:case"end":return t.stop()}}),t)})))),{scrollerRef:e,scroll:t}}}},a2c6:function(e,t,c){},fdab:function(e,t,c){"use strict";c("8f03")}}]);