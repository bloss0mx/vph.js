import { testType, log } from './utils';
import _ from 'lodash';
import $ from 'jquery';
import { exposeToWindow } from './Lady_tool';

class TextDom {
  constructor(name, store, index, baseDataName) {
    this.name = name;
    this.template = name;
    this.baseDataName = baseDataName;
    this.dom = document.createTextNode(name);
    this.store = store === undefined ? {} : store;
    console.log(baseDataName);
    if (baseDataName !== undefined) {
      if (index === undefined) {
        throw ('TextDom no index with baseDataName!');
      }
      this.findOrigin(`${baseDataName}.${index}`, this.dom);
    } else {
      this.findOrigin(name.replace(/\{|\}/g, ''), this.dom);
    }
  }
  findOrigin(name, node, index) {
    log(this.store);
    const found = this.store.outputData(name);
    if (found !== undefined) {
      console.log(found, name, this.store);
      found.addPush(this);
    }
  }
  run(data, type, index) {
    if (this.name === '{{x}}') {
      console.warn('>>>>');
    }
    this.dom.textContent = data;
  }
  giveDom() {
    if (this.name === '{{x}}')
      exposeToWindow(Math.floor(Math.random() * 100), this.dom);
    return this.dom;
  }
  rmSelf() {
    const valueName = this.template.match(/\{\{[^\s]+\}\}/);
    if (valueName[0]) {
      const value = valueName[0] && valueName[0].replace(/\{|\}/g, '');
      const found = this.store.outputData(value);
      if (found !== undefined) {
        found.rmPush(this);
      }
    }
    this.dom = null;
  }
}

class PlainText {
  constructor(name) {
    this.dom = document.createTextNode(name);
  }
  giveDom() {
    return this.dom;
  }
  rmSelf() { }
}

class AttrObj {
  constructor(init) {
    this.dom = init.dom;
    const attrData = init.attr.split('=');
    this.name = attrData[0] ? attrData[0] : '';
    this.store = init.store;
    this.template = attrData[1] ? attrData[1] : undefined;
    this.value = attrData[1] ? attrData[1] : undefined;
    this.findOrigin(this.value, this.dom);
  }
  findOrigin(tmp, node) {
    const valueName = tmp.match(/\{\{[^\s]+\}\}/);
    if (valueName) {
      const value = valueName[0] && valueName[0].replace(/\{|\}/g, '');
      const found = this.store.outputData(value);
      if (found !== undefined) {
        found.addPush(this);
        this.run(found.outputData());
      }
    }
  }
  rmSelf() {
    const valueName = this.template.match(/\{\{[^\s]+\}\}/);
    if (valueName[0]) {
      const value = valueName[0] && valueName[0].replace(/\{|\}/g, '');
      const found = this.store.outputData(value);
      if (found !== undefined) {
        found.rmPush(this);
      }
    }
    this.dom = null;
  }
  run(data, type, index) {
    if (data) {
      this.value = data;
      const value = this.template.replace(/\{\{[^s]+\}\}/, data);
      $(this.dom).attr(this.name, value);
    } else {
      $(this.dom).removeAttr(this.name);
    }
  }
}

export { TextDom, PlainText, AttrObj };