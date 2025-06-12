// All material copyright Esri, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.28/esri/copyright.txt for details.
//>>built
define(["../../../core/Logger"],function(d){return function(a,b,c){if(null==a)return null;const e=b.readArcadeFeature();b.contextTimeZone=c.$view?.timeZone;try{return a.evaluate({...c,$feature:e},a.services)}catch(f){return d.getLogger("esri.views.2d.support.arcadeOnDemand").warn("Feature arcade evaluation failed:",f),null}}});