// All material copyright Esri, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.28/esri/copyright.txt for details.
//>>built
define("exports ../../chunks/vec3f64 ../projection ./projectBuffer ../support/spatialReferenceUtils ../../layers/graphics/dehydratedPoint".split(" "),function(g,k,h,l,m,n){const c=k.create();g.projectPointToVectorWithEngine=async function(a,d,b,e,p){e??(e=0);const f=a.spatialReference;h.canProjectWithoutEngine(f,b)||null==f||null==b||m.equals(f,b)?(c[0]=a.x,c[1]=a.y,c[2]=a.z??e,l.projectBuffer(c,a.spatialReference,0,d,b,0,1)):(a=n.makeDehydratedPoint(a.x,a.y,a.z??e,f),b=await h.projectWithZConversion(a,
b,p),d[0]=b.x,d[1]=b.y,d[2]=b.z??0)};Object.defineProperty(g,Symbol.toStringTag,{value:"Module"})});