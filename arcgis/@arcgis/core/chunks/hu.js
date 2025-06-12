/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.28/esri/copyright.txt for details.
*/
import{d as r}from"./calcite-input-time-picker.js";import"./index.js";import"./form.js";import"./dom.js";import"./guid.js";import"./interactive.js";import"./key.js";import"./label2.js";import"./loadable.js";import"./locale2.js";import"./observers.js";import"./Heading2.js";import"./t9n.js";import"./math.js";import"./icon.js";import"./openCloseComponent.js";import"./action.js";import"./loader.js";import"./input.js";import"./progress.js";import"./popover2.js";import"./floating-ui.js";import"./debounce.js";import"./FloatingArrow.js";
/*!
 * All material copyright ESRI, All Rights Reserved, unless otherwise specified.
 * See https://github.com/Esri/calcite-design-system/blob/main/LICENSE.md for details.
 * v1.9.2
 */
var t={name:"hu",weekdays:"vasárnap_hétfő_kedd_szerda_csütörtök_péntek_szombat".split("_"),weekdaysShort:"vas_hét_kedd_sze_csüt_pén_szo".split("_"),weekdaysMin:"v_h_k_sze_cs_p_szo".split("_"),months:"január_február_március_április_május_június_július_augusztus_szeptember_október_november_december".split("_"),monthsShort:"jan_feb_márc_ápr_máj_jún_júl_aug_szept_okt_nov_dec".split("_"),ordinal:function(r){return r+"."},weekStart:1,relativeTime:{future:"%s múlva",past:"%s",s:function(r,t,e,n){return"néhány másodperc"+(n||t?"":"e")},m:function(r,t,e,n){return"egy perc"+(n||t?"":"e")},mm:function(r,t,e,n){return r+" perc"+(n||t?"":"e")},h:function(r,t,e,n){return"egy "+(n||t?"óra":"órája")},hh:function(r,t,e,n){return r+" "+(n||t?"óra":"órája")},d:function(r,t,e,n){return"egy "+(n||t?"nap":"napja")},dd:function(r,t,e,n){return r+" "+(n||t?"nap":"napja")},M:function(r,t,e,n){return"egy "+(n||t?"hónap":"hónapja")},MM:function(r,t,e,n){return r+" "+(n||t?"hónap":"hónapja")},y:function(r,t,e,n){return"egy "+(n||t?"év":"éve")},yy:function(r,t,e,n){return r+" "+(n||t?"év":"éve")}},formats:{LT:"H:mm",LTS:"H:mm:ss",L:"YYYY.MM.DD.",LL:"YYYY. MMMM D.",LLL:"YYYY. MMMM D. H:mm",LLLL:"YYYY. MMMM D., dddd H:mm"}};r.locale(t,null,!0);export{t as default};
