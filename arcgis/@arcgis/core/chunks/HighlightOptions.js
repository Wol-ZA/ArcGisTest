/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.28/esri/copyright.txt for details.
*/
import{_ as o}from"./tslib.es6.js";import r from"../Color.js";import t from"../core/Accessor.js";import{property as s}from"../core/accessorSupport/decorators/property.js";import"./ensureType.js";import"./typedArrayUtil.js";import{subclass as i}from"../core/accessorSupport/decorators/subclass.js";let p=class extends t{constructor(){super(...arguments),this.color=new r([0,255,255]),this.haloOpacity=1,this.fillOpacity=.25}equals(o){return this.color.equals(o.color)&&(this.haloColor||this.color).equals(o.haloColor||o.color)&&this.haloOpacity===o.haloOpacity&&this.fillOpacity===o.fillOpacity}};o([s({type:r})],p.prototype,"color",void 0),o([s({type:r})],p.prototype,"haloColor",void 0),o([s()],p.prototype,"haloOpacity",void 0),o([s()],p.prototype,"fillOpacity",void 0),p=o([i("esri.views.2d.support.HighlightOptions")],p);const l=p;export{l as H};
