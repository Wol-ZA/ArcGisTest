/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.28/esri/copyright.txt for details.
*/
import{D as t}from"./constraints.js";import{L as s}from"./snappingUtils.js";import{F as n}from"./EdgeSnappingCandidate.js";import{L as i}from"./LineSnappingHint.js";class r extends n{constructor(s){super({...s,isDraped:!0,constraint:new t(s.edgeStart,s.edgeEnd,s.getGroundElevation)})}get hints(){return[new i(s.REFERENCE,this.constraint.start,this.constraint.end,this.isDraped,this.domain)]}}export{r as D};
