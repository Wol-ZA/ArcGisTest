/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.28/esri/copyright.txt for details.
*/
import{W as e}from"./enums4.js";import{G as r}from"./BaseGraphicContainer.js";class i extends r{renderChildren(r){this.attributeView.update(),this.children.some((e=>e.hasData))&&(this.attributeView.bindTextures(r.context,!1),super.renderChildren(r),r.drawPhase===e.MAP&&this._renderChildren(r),this.hasHighlight&&r.drawPhase===e.HIGHLIGHT&&this._renderHighlight(r),this._boundsRenderer&&this._boundsRenderer.doRender(r))}_renderHighlight(e){const{painter:r}=e,i=r.effects.highlight;i.bind(e),this._renderChildren(e,i.defines),i.draw(e),i.unbind()}}export{i as G};
