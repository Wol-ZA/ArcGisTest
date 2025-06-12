// All material copyright Esri, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.28/esri/copyright.txt for details.
//>>built
define("exports ../../geometry ../utils ./operations/queryTopFeatures ../support/TopFeaturesQuery ../../geometry/Extent".split(" "),function(c,k,d,e,f,g){c.executeForTopExtents=async function(b,a,h){b=d.parseUrl(b);a=await e.executeQueryForTopExtents(b,f.from(a),{...h});return{count:a.data.count,extent:g.fromJSON(a.data.extent)}};Object.defineProperty(c,Symbol.toStringTag,{value:"Module"})});