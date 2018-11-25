import { testType, log } from './utils';
import _ from 'lodash';
import $ from 'jquery';

class IfDirective {
  constructor(init) {
    this.flagName = init.flagName;
    this.store = init.store;
    this.pt = init.pt;
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
    this.pt.ifDirectiveOperate(data);
  }
}
class forDirective {
  constructor() {
  }
}

export { IfDirective, forDirective };