/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.28/esri/copyright.txt for details.
*/
import"./typedArrayUtil.js";import"./Logger.js";import{e as t,h as e}from"./vec3.js";var i;!function(t){t[t.FEATURE=1]="FEATURE",t[t.SELF=2]="SELF",t[t.ALL=3]="ALL"}(i||(i={}));class s{constructor(t,e){this.isDraped=t,this.domain=e}}class a extends s{constructor(t,e,s,a,n=i.ALL,r=!0,h=!0){super(a,n),this.type=t,this.lineStart=e,this.lineEnd=s,this.fadeLeft=r,this.fadeRight=h}equals(e){return e instanceof a&&this.type===e.type&&t(this.lineStart,e.lineStart)&&t(this.lineEnd,e.lineEnd)&&this.fadeLeft===e.fadeLeft&&this.fadeRight===e.fadeRight}get length(){return e(this.lineStart,this.lineEnd)}}export{a as L,i as S,s as a};
