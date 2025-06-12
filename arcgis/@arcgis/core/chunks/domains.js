/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.28/esri/copyright.txt for details.
*/
import"./typedArrayUtil.js";import r from"../layers/support/CodedValueDomain.js";import e from"../layers/support/Domain.js";import t from"../layers/support/InheritedDomain.js";import o from"../layers/support/RangeDomain.js";const a={key:"type",base:e,typeMap:{range:o,"coded-value":r,inherited:t}};function s(e){if(!e?.type)return null;switch(e.type){case"range":return o.fromJSON(e);case"codedValue":return r.fromJSON(e);case"inherited":return t.fromJSON(e)}return null}export{s as f,a as t};
