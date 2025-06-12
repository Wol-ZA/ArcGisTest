// All material copyright Esri, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.28/esri/copyright.txt for details.
//>>built
define(["../layers/support/PerformanceInfoLayerView","../terrain/terrainUtils"],function(b,c){class d{constructor(a,e){this.layer=null;this.displayedNumberOfFeatures=this.memory=0;this.totalNumberOfFeatures=this.maximumNumberOfFeatures=null;this.layer=a.layer;this.memory=c.isSurfaceLayerView(a)?e.basemapTerrain.getUsedMemoryForLayerView(a):a.usedMemory;b.isPerformanceInfoLayerView(a)&&(a=a.performanceInfo,this.displayedNumberOfFeatures=a.displayedNumberOfFeatures,this.maximumNumberOfFeatures=a.maximumNumberOfFeatures,
this.totalNumberOfFeatures=a.totalNumberOfFeatures)}}return d});