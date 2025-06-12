// All material copyright Esri, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.28/esri/copyright.txt for details.
//>>built
define(["exports"],function(e){class f{constructor(a){this._allocations=new Map;a?Error.stackTraceLimit=Infinity:(this.add=()=>{},this.remove=()=>{})}add(a){this._allocations.set(a,Error().stack)}remove(a){this._allocations.delete(a)}get information(){let a="";if(0<this._allocations.size){a+=`${this._allocations.size} live object allocations:\n`;const d=new Map;this._allocations.forEach(c=>{d.set(c,(d.get(c)??0)+1)});d.forEach((c,b)=>{b=b.split("\n");b.shift();b.shift();a+=`${c}: ${b.shift()}\n`;
b.forEach(g=>a+=`   ${g}\n`)})}return a}}e.AllocationTracer=f;Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})});