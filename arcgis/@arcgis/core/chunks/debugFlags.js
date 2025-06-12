/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.28/esri/copyright.txt for details.
*/
import{_ as r}from"./tslib.es6.js";import o from"../core/Accessor.js";import{property as s}from"../core/accessorSupport/decorators/property.js";import"./ensureType.js";import"./typedArrayUtil.js";import{subclass as t}from"../core/accessorSupport/decorators/subclass.js";let e=class extends o{constructor(){super(...arguments),this.SCHEDULER_LOG_SLOW_TASKS=!1,this.FEATURE_SERVICE_SNAPPING_SOURCE_TILE_TREE_SHOW_TILES=!1}};r([s()],e.prototype,"SCHEDULER_LOG_SLOW_TASKS",void 0),r([s()],e.prototype,"FEATURE_SERVICE_SNAPPING_SOURCE_TILE_TREE_SHOW_TILES",void 0),e=r([t("esri.views.support.DebugFlags")],e);const p=new e;export{p as d};
