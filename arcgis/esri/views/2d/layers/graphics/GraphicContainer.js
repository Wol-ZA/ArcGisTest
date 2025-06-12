// All material copyright Esri, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.28/esri/copyright.txt for details.
//>>built
define(["../../engine/webgl/enums","./BaseGraphicContainer"],function(c,d){class e extends d{renderChildren(a){this.attributeView.update();this.children.some(b=>b.hasData)&&(this.attributeView.bindTextures(a.context,!1),super.renderChildren(a),a.drawPhase===c.WGLDrawPhase.MAP&&this._renderChildren(a),this.hasHighlight&&a.drawPhase===c.WGLDrawPhase.HIGHLIGHT&&this._renderHighlight(a),this._boundsRenderer&&this._boundsRenderer.doRender(a))}_renderHighlight(a){var {painter:b}=a;b=b.effects.highlight;
b.bind(a);this._renderChildren(a,b.defines);b.draw(a);b.unbind()}}return e});