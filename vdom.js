import { testType, log } from './utils';
import _ from 'lodash';
import $ from 'jquery';
import { DataUnit, Arrayy, Objecty, dataFactory } from './DataUnit';
import { TextDom, PlainText, AttrObj } from './domObj';
import { vdFactory } from './vph';
import { IfDirective, forDirective } from './directive';
import { ARRAYY_OPERATE } from './constant';

/**
 * 初始化时，dom操作必须同步
 */
export default class VirtualDom {
  constructor(init) {
    this.init = init;
    this.name = init.name;
    this.tag = init.tag;
    this.attr = init.attr;
    this.attrPt = [];
    this.children = init.children;
    this.childrenPt = [];
    this.ifDirective = init.ifDirective || null;
    this.forDirective = init.forDirective || null;
    this.varibleName = init.varibleName !== undefined ? init.varibleName : undefined;
    this.baseDataName = init.baseDataName !== undefined ? init.baseDataName : undefined;
    this.setFather(init.father, init.index);

    this.store = init.store === undefined ? {} : init.store;//本地store存储
    this.props = init.props === undefined ? {} : init.props;//父节点传入store
    this.actions = init.actions;

    this.forDirective ? this.setFatherDomAsDom() : this.initDom();
    this.bindActions();
    init.state === undefined ? null : this.initState(init.state);
    if (!this.forDirective) this.makeChildren();
    if (init.whenInit !== undefined && typeof init.whenInit === 'function') {
      setTimeout(() => {
        init.whenInit.apply(this);
      }, 0);
    }
    this.attrPt = this.initAttr();
    this.ifDirectivePt = this.initIf();
    this.forDirective ? this.forDirectivePt = this.initFor(init.forDirective, init) : null;
  }
  setFatherDomAsDom() {
    this.dom = document.createDocumentFragment();
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
    log('initState', init);
    this.store = dataFactory(init);
  }
  initIf() {
    const ifDirective = this.ifDirective;
    if (!ifDirective) {
      return;
    }
    log('========  if  =========');
    return new IfDirective({ flagName: ifDirective, pt: this, store: this.store });
  }
  initFor() {
    const _directive = this.forDirective;
    if (!_directive) {
      return;
    }
    this.forIndex = 0;//for指令的index
    this.forDomPt = [];
    log('========  for  =========');

    return new forDirective({ directive: _directive, pt: this, store: this.store });
  }
  bindActions() {
    const actions = this.actions;
    if (actions !== undefined) {
      for (var i in actions) {
        this[i] = actions[i].bind(this);
      }
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
    this.childrenPt = this.children.map((item, index) => {
      if (item && item.__proto__.constructor === VirtualDom) {
        item.setFather(this, index);
        log('this is a Component');
        this.dom.appendChild(item.giveDom());
        return item;
      } else if (testType(item) === 'string') {
        if (item.match(/\{\{[^\s]*\}\}/)) {
          const textNode = new TextDom(item,
            this.store,
            this.varibleName !== undefined ? this.varibleName : index,
            this.baseDataName
          );
          this.dom.appendChild(textNode.giveDom());
          return textNode;
        } else {
          const textNode = new PlainText(item);
          this.dom.appendChild(textNode.giveDom());
          return textNode;
        }
      } else if (testType(item) === 'object') {
        const { store, ...other } = item;
        const node = vdFactory({
          // baseDataName: this.baseDataName,
          store: this.store,
          father: this,
          index: index,
          ...other
        });
        this.dom.appendChild(node.giveDom());
        return node;
      }
    });
  }
  makeForChildren(childInitMsg) {
    const init = this.init;
    delete init.ifDirective;
    delete init.forDirective;
    init.varibleName = childInitMsg.varibleName;
    init.baseDataName = childInitMsg.baseDataName;
    init.store = this.store;
    init.props = this.props;
    const vdom = vdFactory(init);
    return {
      tmpDom: vdom.giveDom(),
      tmpChildrenPt: vdom,
    };
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
  giveDom() {
    return this.dom;
  }
  rmSelf(trace) {
    this.childrenPt.map(item => {
      item.rmSelf && item.rmSelf(trace);
    });
    this.attrPt.map(item => {
      item.rmSelf && item.rmSelf(trace);
    });
    // if (this.childrenPt) {
    //   console.log(this.childrenPt);
    //   for (let i = 0; i < this.childrenPt.length; i++) {
    //     this.childrenPt[i].rmSelf && this.childrenPt[i].rmSelf();
    //     this.childrenPt = null;
    //   }
    // }
    $(this.dom).remove();
    this.dom = null;
  }
  insertToAvilableBefore(dom, deviation) {
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