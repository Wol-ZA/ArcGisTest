/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.28/esri/copyright.txt for details.
*/
import e from"../request.js";import o from"../core/Error.js";async function r(r,n,t,s,a,i){let l=null;if(null!=t){const o=`${r}/nodepages/`,n=o+Math.floor(t.rootIndex/t.nodesPerPage);try{return{type:"page",rootPage:(await e(n,{query:{f:"json",token:s},responseType:"json",signal:i})).data,rootIndex:t.rootIndex,pageSize:t.nodesPerPage,lodMetric:t.lodSelectionMetricType,urlPrefix:o}}catch(e){null!=a&&a.warn("#fetchIndexInfo()","Failed to load root node page. Falling back to node documents.",n,e),l=e}}if(!n)return null;const d=n?.split("/").pop(),p=`${r}/nodes/`,c=p+d;try{return{type:"node",rootNode:(await e(c,{query:{f:"json",token:s},responseType:"json",signal:i})).data,urlPrefix:p}}catch(e){throw new o("sceneservice:root-node-missing","Root node missing.",{pageError:l,nodeError:e,url:c})}}export{r as f};
