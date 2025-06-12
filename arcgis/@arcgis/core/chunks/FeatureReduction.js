/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.28/esri/copyright.txt for details.
*/
import{_ as r}from"./tslib.es6.js";import{JSONSupport as e}from"../core/JSONSupport.js";import{property as o}from"../core/accessorSupport/decorators/property.js";import"./ensureType.js";import"./typedArrayUtil.js";import{subclass as s}from"../core/accessorSupport/decorators/subclass.js";let t=class extends e{constructor(){super(...arguments),this.type=null}};r([o({type:["selection","cluster","binning"],readOnly:!0,json:{read:!1,write:!0}})],t.prototype,"type",void 0),t=r([s("esri.layers.support.FeatureReduction")],t);export{t as F};
