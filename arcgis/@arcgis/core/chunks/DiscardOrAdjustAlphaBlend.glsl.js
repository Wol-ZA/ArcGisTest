/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.28/esri/copyright.txt for details.
*/
import{s as o}from"./AlphaCutoff.js";import{g as a}from"./interfaces3.js";function r(r){r.fragment.code.add(a`
    #define discardOrAdjustAlpha(color) { if (color.a < ${a.float(o)}) { discard; } }
  `)}export{r as D};
