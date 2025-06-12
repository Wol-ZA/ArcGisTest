// All material copyright Esri, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.28/esri/copyright.txt for details.
//>>built
define("../../../chunks/tslib.es6 ../../../core/Logger ../../../core/accessorSupport/ensureType ../../../core/arrayUtils ../../../core/has ../../../core/Error ../../../core/accessorSupport/decorators/subclass ../SizeSlider/SizeSliderViewModel".split(" "),function(f,a,k,l,m,n,g,h){a=class extends h{constructor(b){super(b)}getStopInfo(){const {min:b,max:c,stops:d}=this;return d?.length?d.map(e=>({color:e.color,offset:(c-e.value)/(c-b)})):[]}};return a=f.__decorate([g.subclass("esri.widgets.smartMapping.ColorSizeSlider.ColorSizeSliderViewModel")],
a)});