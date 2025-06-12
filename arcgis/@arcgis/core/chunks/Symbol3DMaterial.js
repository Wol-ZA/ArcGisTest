/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.28/esri/copyright.txt for details.
*/
import{_ as o}from"./tslib.es6.js";import{JSONSupport as r}from"../core/JSONSupport.js";import{property as s}from"../core/accessorSupport/decorators/property.js";import"./ensureType.js";import"./typedArrayUtil.js";import{subclass as t}from"../core/accessorSupport/decorators/subclass.js";import{c as e}from"./materialUtils.js";var l;let p=l=class extends r{constructor(o){super(o),this.color=null}clone(){const o={color:null!=this.color?this.color.clone():null};return new l(o)}};o([s(e)],p.prototype,"color",void 0),p=l=o([t("esri.symbols.support.Symbol3DMaterial")],p);export{p as S};
