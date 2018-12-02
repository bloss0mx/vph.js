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
    this.findOrigin();
  }
  findOrigin(node) {
    const found = this.store.outputData(this.flagName);
    if (found !== undefined) {
      found.addPush(this);
    }
  }
  run(data, type, index) {
    if (this.flagNamel === 'index2');
    console.log('run');
    this.ifDirectiveOperate(data == this.key);
  }
  // deletePt() {
  //   const found = this.store.outputData(name);
  //   if (found !== undefined) {
  //     found.rmPush(this);
  //   }
  // }
  ifDirectiveOperate(flag) {
    // if (this.flagName === 'index2') {
    //   console.log('index2');
    // }
    if (flag) {
      this.pt.show();
    } else {
      this.pt.hide('how');
    }
  }
  rmSelf() {
    const found = this.store.outputData(this.flagName);
    if (found !== undefined) {
      found.rmPush(this);
    }
  }
}
class forDirective {
  constructor(init) {
    this.store = init.store;
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
    if (found !== undefined) {
      found.addPush(this);
      this.init();
    }
  }
  init() {
    const baseData = this.store.outputData(this.baseDataName)
    const childrenStore = baseData.map((item, index) => {
      return item;
    });
    childrenStore.map((item, index) => {
      const { tmpDom, tmpChildrenPt } = this.pt.makeForChildren({
        varibleName: index,
        forStore: baseData,
        baseDataName: this.baseDataName,
        // ...item
      });
      this.pt.dom.appendChild(tmpDom);
      // this.pt.insertToAvilableBefore(tmpDom, index);

      this.pt.childrenPt.push(tmpChildrenPt);
      item.addPush(tmpChildrenPt);
      this.childrenDom.push(tmpDom);
      this.childrenPt.push(tmpChildrenPt);
    });
  }
  run(data, type, index, operate) {
    this.forDirectiveOperate(data, index, operate);
  }
  addToList(data, index) {
    const targetIndex = index - 1;
    const baseData = this.store.outputData(this.baseDataName)
    const childrenStore = baseData.outputData(targetIndex);
    const { tmpDom, tmpChildrenPt } = this.pt.makeForChildren({
      varibleName: targetIndex,
      forStore: baseData,
      baseDataName: this.baseDataName,
    });
    if (this.pt.childrenPt.length === 0 && this.pt.index > 0) {
      if (this.pt.father.childrenPt.length === 0) {
        $(this.pt.father.dom).prepend(tmpDom);
      } else {
        $(tmpDom).insertAfter($(this.pt.father.childrenPt[this.pt.index - 1].dom));
      }
    } else if (this.pt.childrenPt.length === 0 && this.pt.index === 0) {
      $(this.pt.father.dom).prepend(tmpDom);
    } else if (this.childrenDom[targetIndex - 1]) {
      $(tmpDom).insertAfter(this.childrenDom[targetIndex - 1]);
    }
    this.pt.childrenPt.splice(index, 0, tmpChildrenPt);
    childrenStore.addPush(tmpChildrenPt);
    this.childrenDom.splice(index, 0, tmpDom);
    this.childrenPt.splice(index, 0, tmpChildrenPt);
  }
  rmFromList(data, index) {
    this.pt.childrenPt.splice(index, 1);
    this.childrenPt[index].rmSelf();
    this.childrenPt.splice(index, 1);
    $(this.childrenDom[index]).remove();
    this.childrenDom.splice(index, 1);
  }
  forDirectiveOperate(data, index, operate) {
  }
}

class onDirective {
  constructor(init) {
    this.store = init.store;
    this.pt = init.pt;
    this.callback = init.callback;
    this.directive = init.directive;//'input.'

    this.init();
    this.findCallback();
    this.findOrigin();
  }
  init() {
    const splited = this.directive.split('.');
    const handled = splited.map(item => {
      return item.replace(/[\s]*/, '');
    })
    this.eventType = handled[0];
    this.callbackName = handled[1];
  }
  findOrigin() {
    if (this.eventType && this.callback) {
      this.pt.dom.addEventListener(this.eventType, this.callback);
    }
  }
  findCallback() {
    let pt = this.pt;
    for (; ;) {
      if (pt.father) {
        pt = pt.father;
      } else {
        break;
      }
    }
    if (pt.actions && pt.actions[this.callbackName]) {
      this.callback = pt.actions[this.callbackName].bind(pt);
    }
  }
  rmSelf() {
    this.pt.dom.removeEventListener(this.eventType, this.callback);
  }
}

export { IfDirective, forDirective, onDirective };



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
  if (operate === ARRAYY_OPERATE['add']) {
    if (this.pt.forDomPt.length === 0) {
      const { tmpDom, tmpChildrenPt } = this.pt.makeForChildren();
      this.pt.insertToAvilableBefore(tmpDom);
      this.pt.forDomPt.push(tmpChildrenPt);
    } else {
      const { tmpDom, tmpChildrenPt } = this.pt.makeForChildren();
      const targetDom = nextNBrother(this.pt.previousBrother());
      this.pt.forDomPt.push(tmpChildrenPt);
      targetDom.append(tmpDom);
      // 列表to do 注册attr
    }
  } else if (operate === ARRAYY_OPERATE['set']) {
  } else if (operate === ARRAYY_OPERATE['rm']) {
  }
}