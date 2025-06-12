/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.28/esri/copyright.txt for details.
*/
import{_ as r}from"./tslib.es6.js";import{L as e}from"./Logger.js";import{isAbortError as s}from"../core/promiseUtils.js";import{on as o}from"../core/reactiveUtils.js";import{property as t}from"../core/accessorSupport/decorators/property.js";import"./ensureType.js";import"./typedArrayUtil.js";import{subclass as i}from"../core/accessorSupport/decorators/subclass.js";const a=a=>{let p=class extends a{initialize(){this.addHandles(o((()=>this.layer),"refresh",(r=>{this.doRefresh(r.dataChanged).catch((r=>{s(r)||e.getLogger(this).error(r)}))})),"RefreshableLayerView")}};return r([t()],p.prototype,"layer",void 0),p=r([i("esri.layers.mixins.RefreshableLayerView")],p),p};export{a as R};
