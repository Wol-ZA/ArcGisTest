/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.28/esri/copyright.txt for details.
*/
import{g as i}from"./interfaces3.js";import{V as t}from"./VertexAttribute.js";function o(o,e=!0){o.attributes.add(t.POSITION,"vec2"),e&&o.varyings.add("uv","vec2"),o.vertex.code.add(i`
    void main(void) {
      gl_Position = vec4(position, 0.0, 1.0);
      ${e?i`uv = position * 0.5 + vec2(0.5);`:""}
    }
  `)}export{o as S};
