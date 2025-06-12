/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.28/esri/copyright.txt for details.
*/
class s{constructor(s=null,t={},h,e){this.geometry=s,this.attributes=t,this.centroid=h,this.objectId=e,this.displayId=0,this.geohashX=0,this.geohashY=0}weakClone(){const t=new s(this.geometry,this.attributes,this.centroid,this.objectId);return t.displayId=this.displayId,t.geohashX=this.geohashX,t.geohashY=this.geohashY,t}}function t(s){return!!s.geometry?.coords?.length}class h extends s{}export{s as O,h as a,t as h};
