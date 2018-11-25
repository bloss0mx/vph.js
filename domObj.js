import { testType, log } from './utils';
import _ from 'lodash';
import $ from 'jquery';
import { DataUnit, Arrayy, dataFactory } from './DataUnit';

class TextDom {
  constructor(name, store) {
    this.name = name;
    this.dom = document.createTextNode(name);
    this.store = store === undefined ? {} : store;
    this.findOrigin(name.replace(/\{|\}/g, ''), this.dom);
  }
  findOrigin(name, node) {
    log(this.store);
    const found = this.store.outputData(name);
    if (found !== undefined) {
      console.log(found, name, this.store);
      found.addPush(this);
    }
  }
  run(data, type, index) {
    this.dom.textContent = data;
  }
  giveDom() {
    return this.dom;
  }
}

class PlainText {
  constructor(name) {
    this.dom = document.createTextNode(name);
  }
  giveDom() {
    return this.dom;
  }
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