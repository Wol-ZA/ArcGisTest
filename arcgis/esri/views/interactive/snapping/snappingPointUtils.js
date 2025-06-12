// All material copyright Esri, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.28/esri/copyright.txt for details.
//>>built
define(["exports","../../../layers/graphics/dehydratedPoint","../../../support/elevationInfoUtils"],function(f,e,g){f.snappingPointToSnappingOutput=function(a,c,{z:h,m:b,spatialReference:d,elevationInfo:k}){if(null==h&&null==b)return a=e.makeDehydratedPoint(a[0],a[1],void 0,d),null!=b&&(a.m=b,a.hasM=!0),a;if(null==c||"2d"===c.type)return a=e.makeDehydratedPoint(a[0],a[1],h,d),null!=b&&(a.m=b,a.hasM=!0),a;c=g.getConvertedElevationFromVector(c,a,d,g.absoluteHeightElevationInfo,k)??0;a=e.makeDehydratedPoint(a[0],
a[1],c,d);null!=b&&(a.m=b,a.hasM=!0);return a};Object.defineProperty(f,Symbol.toStringTag,{value:"Module"})});