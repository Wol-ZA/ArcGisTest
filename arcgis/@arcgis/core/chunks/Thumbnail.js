/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.28/esri/copyright.txt for details.
*/
import{_ as r}from"./tslib.es6.js";import s from"../core/Accessor.js";import{property as o}from"../core/accessorSupport/decorators/property.js";import"./ensureType.js";import"./typedArrayUtil.js";import{subclass as t}from"../core/accessorSupport/decorators/subclass.js";var e;let p=e=class extends s{constructor(){super(...arguments),this.url=""}clone(){return new e({url:this.url})}};r([o({type:String})],p.prototype,"url",void 0),p=e=r([t("esri.symbols.support.Thumbnail")],p);export{p as T};
