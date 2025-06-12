// All material copyright Esri, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.28/esri/copyright.txt for details.
//>>built
define(["./WGLDisplayRecord","./util/serializationUtils"],function(f,d){class b{constructor(a){this.insertAfter=null;this.id=a;this.displayRecords=[]}copy(){const a=new b(this.id);a.set(this);return a}clone(){const a=new b(this.id);a.displayRecords=this.displayRecords.map(c=>c.clone());a.insertAfter=this.insertAfter;return a}set(a){this.id=a.id;this.displayRecords=a.displayRecords;this.insertAfter=a.insertAfter}serialize(a){a.push(this.id);d.serializeList(a,this.displayRecords);return a}static deserialize(a){const c=
a.readInt32(),e=new b(c);e.displayRecords=d.deserializeList(a,f,{id:c})??[];return e}}return b});