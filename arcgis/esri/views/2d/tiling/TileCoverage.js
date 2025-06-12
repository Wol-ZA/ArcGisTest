// All material copyright Esri, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.28/esri/copyright.txt for details.
//>>built
define(["../../../core/ObjectPool"],function(f){class b{constructor(){this.spans=[]}acquire(c){this.lodInfo=c}release(){this.lodInfo=null;this.spans.length=0}forEach(c,g){const {spans:e,lodInfo:d}=this,{level:h}=d;if(0!==e.length)for(const {row:k,colFrom:l,colTo:m}of e)for(let a=l;a<=m;a++)c.call(g,h,k,d.normalizeCol(a),d.getWorldForColumn(a))}}b.pool=new f(b);return b});