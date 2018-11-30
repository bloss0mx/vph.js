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
  // deletePt() {
  //   const found = this.store.outputData(name);
  //   if (found !== undefined) {
  //     found.rmPush(this);
  //   }
  // }
  ifDirectiveOperate(flag) {
    if (flag) {
      if (!this.pt.dom) {
        this.pt.initDom();
        this.pt.makeChildren();
        this.pt.insertToAvilableBefore(this.pt.giveDom());
        this.pt.attrPt = this.pt.initAttr();
      }
    } else {
      // this.pt.attrPt.map(item => {
      //   item.rmSelf('hey');
      // });
      // this.pt.rmSelf();
      this.pt.rmSelf('how');
      // this.deletePt();
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
    const childrenStore = this.store.outputData(this.baseDataName)
      .map((item, index) => {
        return item;
      });
    childrenStore.map((item, index) => {
      const { tmpDom, tmpChildrenPt } = this.pt.makeForChildren({
        varibleName: index,
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
    log('=========');
    log(data, type, index);
    log(this.store);
    this.forDirectiveOperate(data, index, operate);
  }
  addToList(data, index) {
    const targetIndex = index - 1;
    const childrenStore = this.store.outputData(this.baseDataName + '.' + (targetIndex));
    const { tmpDom, tmpChildrenPt } = this.pt.makeForChildren({
      varibleName: targetIndex,
      baseDataName: this.baseDataName,
    });

    if (this.childrenDom[targetIndex - 1]) {
      $(tmpDom).insertAfter(this.childrenDom[targetIndex - 1]);
    } else {
      this.pt.insertToAvilableBefore(tmpDom);
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
  if (operate === ARRAYY_OPERATE['add']) {
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
  } else if (operate === ARRAYY_OPERATE['rm']) {
  }
}