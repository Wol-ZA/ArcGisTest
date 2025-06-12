/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.28/esri/copyright.txt for details.
*/
import{L as t}from"./constraints.js";import{L as s}from"./snappingUtils.js";import{S as n,L as i}from"./LineSnappingHint.js";class r{constructor(t,s,n,i){this.targetPoint=t,this.constraint=s,this.isDraped=n,this.domain=i}}class a extends r{constructor({targetPoint:t,objectId:s,constraint:i,isDraped:r}){super(t,i,r,n.FEATURE),this.objectId=s}}class o extends a{constructor(s){super({...s,constraint:new t(s.edgeStart,s.edgeEnd)})}get hints(){return[new i(s.REFERENCE,this.constraint.start,this.constraint.end,this.isDraped,this.domain)]}}export{o as E,a as F,r as S};
