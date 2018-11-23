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
    const found = this.store[name];
    if (found !== undefined) {
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

class IfDirective {
  constructor(init) {
    this.flagName = init.flagName;
    this.store = init.store;
    this.pt = init.pt;
    this.findOrigin(init.flagName);
  }
  findOrigin(name, node) {
    log(this.store);
    const found = this.store[name];
    if (found !== undefined) {
      found.addPush(this);
    }
  }
  run(data, type, index) {
    log('======> if', data);
    this.pt.ifDirectiveOperate(data);
  }
}
class forDirective {
  constructor() {
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
      const found = this.store[value];
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
      const found = this.store[value];
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

class VirtualDom {
  constructor(init) {
    this.name = init.name;
    this.tag = init.tag;
    this.attr = init.attr;
    this.initDom();
    this.children = init.children;
    // this.children = [];
    this.childrenPt = [];
    this.ifDirective = init.ifDirective;
    this.setFather(init.father, init.index);

    this.store = init.store === undefined ? {} : init.store;
    this.props = init.props === undefined ? {} : init.props;
    init.state === undefined ? null : this.initState(init.state);

    this.actions = init.actions;
    this.bindActions();
    this.findOrigin();
    this.makeChildren();
    if (init.whenInit !== undefined && typeof init.whenInit === 'function') {
      init.whenInit.apply(this);
    }
    this.refreashAfterInit(init.state);
    this.attrPt = this.initAttr();
    this.ifDirectivePt = this.initIf();
  }
  initDom() {
    log(this);
    this.dom = document.createElement(this.tag);
  }
  setFather(father, index) {
    this.father = father;
    this.index = index;
  }
  initState(init) {
    console.log('initState', init);
    if (testType(init) === 'object') {
      for (let i in init) {
        this.store[i] = dataFactory(init[i]);
      }
    }
  }
  initIf() {
    const ifDirective = this.ifDirective;
    if (!ifDirective) {
      return;
    }
    log('=================');
    return new IfDirective({ flagName: ifDirective, pt: this, store: this.store });
  }
  bindActions() {
    const actions = this.actions;
    if (actions !== undefined) {
      for (var i in actions) {
        this[i] = actions[i].bind(this);
      }
    }
  }
  refreashAfterInit(state) {
    for (let i in state) {
      // console.log(this.store[i]);
      this.store[i].setData(state[i]);
      // this.attrPt[i] && this.attrPt[i].setData(this.store[i].outputData());
    }
  }
  initAttr() {
    const attrArray = this.attr;
    if (!attrArray) {
      return [];
    }
    log(attrArray);
    return attrArray.map((item, index) => {
      log(this.store);
      return new AttrObj({ attr: item, dom: this.dom, store: this.store });
    });
  }
  makeChildren() {
    log(this.children);
    this.childrenPt = this.children.map((item, index) => {
      if (item && item.__proto__.constructor === VirtualDom) {
        item.setFather(this, index);
        log('this is a Component');
        this.dom.appendChild(item.giveDom());
        return item;
      } else if (testType(item) === 'string') {
        if (item.match(/\{\{[^\s]*\}\}/)) {
          const textNode = new TextDom(item, this.store);
          //
          // this.children.push(textNode);
          this.dom.appendChild(textNode.giveDom());
          return textNode;
        } else {
          // const textNode = document.createTextNode(item);
          // //
          // this.children.push(textNode);
          // this.dom.appendChild(textNode);
          // return textNode;
          const textNode = new PlainText(item);
          // this.children.push(textNode);
          this.dom.appendChild(textNode.giveDom());
          return textNode;
        }
      } else if (testType(item) === 'object') {
        const { store, ...other } = item;
        const node = vdFactory({
          store: this.store,
          father: this,
          index: index,
          ...other
        });
        //
        // this.children.push(node);
        this.dom.appendChild(node.giveDom());
        return node;
      }
    });
  }
  findOrigin(name, node) {
    log(name);
    const found = this.store[name];
    if (found !== undefined) {
      found.addPush(node);
    }
  }
  run(data, type, index) {
    if (this.beforeRun !== undefined) {
      this.beforeRun();
    }
    log('I got push: ', data);
    if (this.afterRun !== undefined) {
      this.afterRun();
    }
  }
  ifDirectiveOperate(flag) {
    if (flag) {
      if (!this.dom) {
        this.initDom();
        this.makeChildren();
        this.insertToAvilableBefore(this.giveDom());
        this.attrPt = this.initAttr();
      }
    } else {
      this.attrPt.map(item => {
        item.rmSelf();
      });
      this.removeThis();
    }
  }
  giveDom() {
    return this.dom;
  }
  removeThis() {
    $(this.dom).remove();
    this.dom = null;
  }
  insertToAvilableBefore(dom) {
    const previousBrother = this.previousBrother();
    if (previousBrother) {
      this.insertAfter(previousBrother, dom);
    } else {
      this.insertPre(dom);
    }
  }
  insertAfter(pt, dom) {
    $(dom).insertAfter($(pt));
  }
  insertPre(dom) {
    $(this.dom).prepend($(dom));
  }
  previousBrother() {
    log('father', this.index, this.father.childrenPt);
    if (this.father) {
      for (var i = this.index - 1; i >= 0; i--) {
        if (this.father.childrenPt[i] && this.father.childrenPt[i].giveDom()) {
          log(i);
          return this.father.childrenPt[i].giveDom();
        }
      }
    }
  }
  nextBrother() {
    if (this.father) {
      for (var i = this.index + 1; i < this.father.childrenPt.length; i++) {
        if (this.father.childrenPt[i] && this.father.childrenPt[i].giveDom()) {
          log(i);
          return this.father.childrenPt[i].giveDom();
        }
      }
    }
  }
}

export function vdFactory(init) {
  return new VirtualDom(init);
}

export function div(init) {
  init.tag = 'div';
  return init;
}
export function p(init) {
  init.tag = 'p';
  return init;
}
export function span(init) {
  init.tag = 'span';
  return init;
}
export function makeVd(init) {
  return init;
}