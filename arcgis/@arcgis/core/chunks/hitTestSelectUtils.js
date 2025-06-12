/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.28/esri/copyright.txt for details.
*/
async function t(t,e){if("2d"===t.type)return t.hitTest(e);const s=await t.hitTest(e);if(0===s.results.length)return s;const r=(s.results[0].distance??0)*(1+n),i=s.results.findIndex((t=>(t.distance??0)>r));return-1!==i&&(s.results=s.results.slice(0,i)),s}const n=.05;function e(t){return"graphic"===t?.type}function s(t){return t.find(e)??null}function r(t){return t.filter(e)}export{r as a,s as f,t as h};
