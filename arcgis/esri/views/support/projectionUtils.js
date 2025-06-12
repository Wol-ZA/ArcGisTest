// All material copyright Esri, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.28/esri/copyright.txt for details.
//>>built
define(["require","exports","../../core/promiseUtils","../../geometry/projection"],function(l,h,m,c){async function n(b){f||(f=(new Promise((a,d)=>l(["../../portal/support/geometryServiceUtils"],a,d))).then(a=>g=a));await f;m.throwIfAborted(b)}async function k(b,a,d,e){if(!b)return null;const p=b.spatialReference;if(c.isLoaded()||c.canProjectWithoutEngine(p,a))return c.project(b,a);if(g)return g.projectGeometry(b,a,d,e);await Promise.race([n(e),c.load(e)]);return k(b,a,d,e)}let f=null,g;h.projectWithEngineOrService=
k;Object.defineProperty(h,Symbol.toStringTag,{value:"Module"})});