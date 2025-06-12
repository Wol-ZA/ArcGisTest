/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.28/esri/copyright.txt for details.
*/
import{_ as s}from"./tslib.es6.js";import{watch as e,syncAndInitial as t}from"../core/reactiveUtils.js";import{property as r}from"../core/accessorSupport/decorators/property.js";import"./ensureType.js";import"./typedArrayUtil.js";import{subclass as i}from"../core/accessorSupport/decorators/subclass.js";import{I as a}from"./dragEventPipeline.js";let o=class extends a{constructor(s){super(s)}initialize(){this.addHandles(e((()=>this.analysisViewData.visible),(s=>this.visible=s),t))}deactivate(){this.onDeactivate(),this.created||this.analysis.clear()}resetCreated(){this._set("created",!1)}};s([r({constructOnly:!0})],o.prototype,"analysis",void 0),s([r()],o.prototype,"analysisViewData",void 0),o=s([i("esri.views.interactive.AnalysisToolBase")],o);export{o as A};
