/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.28/esri/copyright.txt for details.
*/
import{_ as r}from"../../chunks/tslib.es6.js";import{property as s}from"../../core/accessorSupport/decorators/property.js";import"../../chunks/ensureType.js";import"../../chunks/typedArrayUtil.js";import{subclass as t}from"../../core/accessorSupport/decorators/subclass.js";import"../../chunks/Logger.js";import"../../config.js";import"../../core/lang.js";import"../../chunks/utils.js";import"../../chunks/handleUtils.js";import"../../chunks/metadata.js";import"../../core/Error.js";import"../../chunks/tracking.js";const o=o=>{let e=class extends o{constructor(){super(...arguments),this.customParameters=null}};return r([s({type:Object,json:{write:{overridePolicy:r=>({enabled:!!(r&&Object.keys(r).length>0)})}}})],e.prototype,"customParameters",void 0),e=r([t("esri.layers.mixins.CustomParametersMixin")],e),e};export{o as CustomParametersMixin};
