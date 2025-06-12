/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.28/esri/copyright.txt for details.
*/
import{_ as e}from"./tslib.es6.js";import{Clonable as r}from"../core/Clonable.js";import{L as o}from"./Logger.js";import"./ensureType.js";import"./typedArrayUtil.js";import"../core/Error.js";import{subclass as t}from"../core/accessorSupport/decorators/subclass.js";import{projectOrLoad as s}from"../geometry/projection.js";let p=class extends r{projectOrWarn(e,r){if(null==e)return e;const{geometry:t,pending:p}=s(e,r);return p?null:p||t?t:(o.getLogger(this).warn("geometry could not be projected to the spatial reference",{georeference:this,geometry:e,sourceSpatialReference:e.spatialReference,targetSpatialReference:r}),null)}};p=e([t("esri.layers.support.GeoreferenceBase")],p);const a=p;export{a as G};
