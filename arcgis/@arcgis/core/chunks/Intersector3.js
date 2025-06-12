/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.28/esri/copyright.txt for details.
*/
import{i as t,I as s,G as r,L as e}from"./Intersector2.js";class n extends r{constructor(t,s,r,e){super(s,r),this.point=t,this.createGraphic=e}}function i(r){return t(r)&&r.intersector===s.PCL&&!!r.target}class a extends e{constructor(t,s,r,e,n){super(t),this.layerUid=t,this.sublayerUid=s,this.nodeIndex=r,this.componentIndex=e,this.triangleNr=n}}class o extends r{constructor(t,s,r){super(s,null),this.point=t,this.createVoxelGraphic=r}}function c(r){return t(r)&&r.intersector===s.I3S&&!!r.target}function u(r){return t(r)&&r.intersector===s.VOXEL&&!!r.target}export{a as I,n as P,o as V,i as a,u as b,c as i};
