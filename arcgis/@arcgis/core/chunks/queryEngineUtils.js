/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.28/esri/copyright.txt for details.
*/
import{g as e}from"./snappingUtils.js";import{D as t}from"./DrapedEdgeSnappingCandidate.js";import{E as n}from"./EdgeSnappingCandidate.js";import{V as r}from"./VertexSnappingCandidate.js";function a({x:t,y:n,z:r}){return e(t,n,r??0)}function d(e,d){switch(e.type){case"edge":return e.draped?new t({edgeStart:a(e.start),edgeEnd:a(e.end),targetPoint:a(e.target),objectId:e.objectId,getGroundElevation:d}):new n({edgeStart:a(e.start),edgeEnd:a(e.end),targetPoint:a(e.target),objectId:e.objectId,isDraped:!1});case"vertex":return new r({targetPoint:a(e.target),objectId:e.objectId,isDraped:!1})}}function o(e,t){return null!=e&&"3d"===e.type?(n,r)=>e.elevationProvider.getElevation(n,r,0,t,"ground"):()=>null}export{d as c,o as m};
