/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.28/esri/copyright.txt for details.
*/
import o from"../core/Error.js";class e extends o{constructor(){super("mesh-not-loaded","Mesh must be loaded before applying operations")}}class s extends o{constructor(){super("component-not-found","Provided component is not part of the list of components")}}class t extends o{constructor(){super("invalid-polygon","expected polygon to be a Polygon instance")}}class n extends o{constructor(){super("invalid-input:location","Expected location to be a Point instance")}}class r extends o{constructor(){super("invalid-input:no-layer","A layer is needed to convert the files")}}class a extends o{constructor(){super("invalid-input:no-model","No supported model found")}}class c extends o{constructor(){super("invalid-input:multiple-models","Multiple supported models found")}}export{s as C,n as I,e as M,r as N,t as a,a as b,c};
