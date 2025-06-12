// All material copyright Esri, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.28/esri/copyright.txt for details.
//>>built
define("exports ../../geometry ../utils ./operations/query ../support/Query ../../geometry/Extent".split(" "),function(b,l,d,e,f,g){b.executeForExtent=async function(a,h,k){a=d.parseUrl(a);return e.executeQueryForExtent(a,f.from(h),{...k}).then(c=>({count:c.data.count,extent:g.fromJSON(c.data.extent)}))};Object.defineProperty(b,Symbol.toStringTag,{value:"Module"})});