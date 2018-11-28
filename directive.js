import { testType, log } from './utils';
import _ from 'lodash';
import $ from 'jquery';
import { ARRAYY_OPERATE } from './constant';

class IfDirective {
  constructor(init) {
    this.flagName = init.flagName;

    this.store = init.store;
    this.pt = init.pt;

    this.key = init.key ? init.key : true;//
    this.findOrigin(init.flagName);
  }
  findOrigin(name, node) {
    log(this.store);
    const found = this.store.outputData(name);
    if (found !== undefined) {
      found.addPush(this);
    }
  }
  run(data, type, index) {
    log('======> if', data);
    // log(data);
    this.ifDirectiveOperate(data == this.key);
  }
  ifDirectiveOperate(flag) {
    if (flag) {
      if (!this.pt.dom) {
        this.pt.initDom();
        this.pt.makeChildren();
        this.pt.insertToAvilableBefore(this.pt.giveDom());
        this.pt.attrPt = this.pt.initAttr();
      }
    } else {
      this.pt.attrPt.map(item => {
        item.rmSelf();
      });
      this.pt.removeThis();
    }
  }
}
class forDirective {
  constructor(init) {
    this.store = init.store;
    console.log('hey here\'s forDirective store!');
    console.log(this.store);
    this.pt = init.pt;
    this.childrenPt = [];
    this.childrenDom = [];

    this.findOrigin(init.directive);
  }
  findOrigin(directive) {
    const splited = directive.split('in');
    const handled = splited.map(item => {
      return item.replace(/[\s]*/, '');
    })
    this.varibleName = handled[0];
    this.baseDataName = handled[1];

    const found = this.store.outputData(this.baseDataName);
    console.log(found);
    if (found !== undefined) {
      found.addPush(this);
      this.init();
    }
  }
  init() {
    const childrenStore = this.store.outputData(this.baseDataName)
      .map((item, index) => {
        return item;
      });
    console.log(childrenStore);
    childrenStore.map((item, index) => {
      const { tmpDom, tmpChildrenPt } = this.pt.makeForChildren({
        varibleName: index,
        baseDataName: this.baseDataName,
        // ...item
      });
      this.pt.dom.appendChild(tmpDom);
      // this.pt.insertToAvilableBefore(tmpDom, index);

      this.pt.childrenPt.push(tmpChildrenPt);
      console.log(tmpChildrenPt);
      item.addPush(tmpChildrenPt);
      this.childrenDom.push(tmpDom);
      this.childrenPt.push(tmpChildrenPt);
    });
    console.log(this.store);
  }
  run(data, type, index, operate) {
    log('=========');
    log(data, type, index);
    log(this.store);
    this.forDirectiveOperate(data, index, operate);
  }
  forDirectiveOperate(data, index, operate) {
    console.log(data);
  }
}

export { IfDirective, forDirective };


function nextNBrother(dom, n) {
  let tmp = dom;
  for (let i = 0; i < n; i++) {
    tmp = $(tmp).next();
  }
  return tmp;
}

function checkConstructor(test, reference) {
  return test.__proto__.constructor === reference;
}

function setDataArrayy() {

}


/**
 * not using
 * @param {*} data 
 * @param {*} index 
 * @param {*} operate 
 */
function forDirectiveOperate(data, index, operate) {
  console.log('=========>', data, index, operate);
  if (operate === ARRAYY_OPERATE['add']) {
    console.log('add ~', data);
    if (this.pt.forDomPt.length === 0) {
      const { tmpDom, tmpChildrenPt } = this.pt.makeForChildren();
      this.pt.insertToAvilableBefore(tmpDom);
      this.pt.forDomPt.push(tmpChildrenPt);
      log('length === 0');
    } else {
      const { tmpDom, tmpChildrenPt } = this.pt.makeForChildren();
      const targetDom = nextNBrother(this.pt.previousBrother());
      this.pt.forDomPt.push(tmpChildrenPt);
      targetDom.append(tmpDom);
      log('length > 0');
      // 列表to do 注册attr
    }
  } else if (operate === ARRAYY_OPERATE['set']) {
    console.log('hey ', this.pt.forDomPt);
  } else if (operate === ARRAYY_OPERATE['rm']) {
  }
}