/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.28/esri/copyright.txt for details.
*/
import{p as e,H as t,c as n,h as l}from"./index.js";import{c as s}from"./observers.js";
/*!
 * All material copyright ESRI, All Rights Reserved, unless otherwise specified.
 * See https://github.com/Esri/calcite-design-system/blob/main/LICENSE.md for details.
 * v1.9.2
 */const a=e(class extends t{constructor(){super(),this.__registerHost(),this.__attachShadow(),this.calciteInternalOptionChange=n(this,"calciteInternalOptionChange",6),this.mutationObserver=s("mutation",(()=>{this.ensureTextContentDependentProps(),this.calciteInternalOptionChange.emit()})),this.disabled=!1,this.label=void 0,this.selected=void 0,this.value=void 0}handlePropChange(e,t,n){"label"!==n&&"value"!==n||this.ensureTextContentDependentProps(),this.calciteInternalOptionChange.emit()}ensureTextContentDependentProps(){const{el:{textContent:e},internallySetLabel:t,internallySetValue:n,label:l,value:s}=this;l&&l!==t||(this.label=e,this.internallySetLabel=e),null!=s&&s!==n||(this.value=e,this.internallySetValue=e)}connectedCallback(){this.ensureTextContentDependentProps(),this.mutationObserver?.observe(this.el,{attributeFilter:["label","value"],characterData:!0,childList:!0,subtree:!0})}disconnectedCallback(){this.mutationObserver?.disconnect()}render(){return l("slot",null,this.label)}get el(){return this}static get watchers(){return{disabled:["handlePropChange"],label:["handlePropChange"],selected:["handlePropChange"],value:["handlePropChange"]}}static get style(){return":host{display:block}:host([hidden]){display:none}[hidden]{display:none}"}},[1,"calcite-option",{disabled:[516],label:[1025],selected:[516],value:[1032]}]);function i(){"undefined"!=typeof customElements&&["calcite-option"].forEach((e=>{"calcite-option"===e&&(customElements.get(e)||customElements.define(e,a))}))}i();const o=a,r=i;export{o as CalciteOption,r as defineCustomElement};
