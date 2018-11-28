import { testType, log } from './utils';
import _ from 'lodash';
import {
  ARRAYY_OPERATE,
} from './constant';

class DataUnit {
  protected data: any;
  protected pushList: Array<any>;
  protected type: String;

  constructor(data: any) {
    this.data;
    this.pushList = [];
    this.type = testType(data);

    if (this.type === 'array' || this.type === 'object') {
      // throw(`DataUnit type error: data = ${data}`);
      return;
    }
    setTimeout(() => {
      this.pushList.map((item, index) => {
        this.data = data;
        item.run && item.run(data, this.type, index, ARRAYY_OPERATE['add']);
      });
    }, 0);
  }

  addPush(pushOrigin) {
    this.pushList.push(pushOrigin);
  }
  rmPush(pushOrigin) {
    this.pushList = _.difference(this.pushList, [pushOrigin]);
  }
  exchangePushList() {
    return this.pushList;
  }
  outputData(index?: (number | string)): any {
    // log('====>', index, this.data);
    if (index && testType(index) === 'string' && index.split('.').length > 1) {
      return [this.data, ...index.split('.')].reduce((t, i) => {
        console.log(t, i);
        return t.outputData ? t.outputData(i) : t[i];
      });
    }
    if (index === undefined && this.type === 'array') {
      return this.data.map(item => {
        return item;
      });
    } else if (index === undefined && this.type === 'object') {
      let _data = {};
      for (let i in this.data) {
        _data[i] = this.data[i];
      }
      return _data;
    } else if (index !== undefined && (this.type === 'array' || this.type === 'object')) {
      return this.data[index];
    } else if (this.type !== 'array' && this.type !== 'object') {
      return this.data;
    }
  }
  setData(data, name?: (number | string)) {

    console.warn('========  setData  ========')
    console.log(name, this.data);

    let isChanged = '';

    if (this.type === 'object' && name !== undefined) {
      this.outputData(name).setData(data);
      // this.data[name].run(data, this.type, name);
      // isChanged = ARRAYY_OPERATE['set'];
    } else if (this.type === 'array' && name !== undefined) {
      console.log(name, data, this.data, this.outputData(name));
      this.outputData(name).setData(data);
      // this.data[name].setData(data);
      // this.data[name].run(data, this.type, name);
      // isChanged = ARRAYY_OPERATE['set'];
    } else if ((this.type === 'object' || this.type === 'array') && name === undefined) {
      console.warn(`DataUnit->setData, type = ${this.type}, data = ${data}, name = ${name}`);
    } else {
      this.type = testType(data);
      this.data = data;
      isChanged = ARRAYY_OPERATE['set'];
    }

    if (isChanged !== '') {
      this.pushList.map((item, index) => {
        console.warn('<<<<<<<', item);
        item.run && item.run(this.data, this.type, index, ARRAYY_OPERATE['set']);
      });
    }
  }
  deleteSelf() {
    for (let i in this) {
      this[i] = null;
    }
  }
}

class Arrayy extends DataUnit {
  protected data: Array<any>;
  private pushFunc: Function;
  private pullFunc: Function;

  constructor(data: Array<any>, pushFunc?: Function, pullFunc?: Function) {
    super(data);
    this.pushList = [];
    this.pushFunc = pushFunc;
    this.cpData(data);
    console.log(this.data);
    this.type = 'array';
  }

  cpData(data: Array<any>): Array<DataUnit> {
    console.warn('==============');
    console.log(data);
    const _data = data.map((item, index) => dataFactory(item));
    console.log(_data);
    this.data = _data;
  }
  /**
   * 插入
   * @param index 插入位置
   * @param len 长度
   * @param data 新内容
   */
  splice(index: number, len: number, ...data) {
    const newData = this.cpData(data);
    return this.data.splice(index, len, newData);
  }
  /**
   * 截取
   * @param index 取出位置
   * @param len 长度
   */
  private difference(index: number, len: number) {
    const newData = this.data.slice(index, len);
    return newData;
  }

  push() {
    this.data = this.splice(this.data.length, 0, ...arguments);
    // this.data.map((item, index) => {
    //   this.pushList.map((i) => {
    //     i.run(item, this.type, this.data.length + index, ARRAYY_OPERATE['add']);
    //   })
    // });
  }
  pop() {
    const _data = this.difference(this.data.length, 1)
    this.data = _.difference(this.data, _data);
    // this.data.map((item, index) => {
    //   this.pushList.map((i) => {
    //     i.run(item, this.type, this.data.length + 1, ARRAYY_OPERATE['rm']);
    //   })
    // });
    return _data;
  }
  unshift() {
    this.data = this.splice(0, 0, ...arguments);
    // this.data.map((item, index) => {
    //   this.pushList.map((i) => {
    //     i.run(item, this.type, 0 + index, ARRAYY_OPERATE['add']);
    //   })
    // });
  }
  shift() {
    const _data = this.difference(0, 1)
    this.data = _.difference(this.data, _data);
    // this.data.map((item, index) => {
    //   this.pushList.map((i) => {
    //     i.run(item, this.type, 0, ARRAYY_OPERATE['rm']);
    //   })
    // });
    return _data;
  }
  slice(index: number, len: number) {
    const data = this.difference(index, len);
    // this.data.map((item, index) => {
    //   this.pushList.map((i) => {
    //     i.run(item, this.type, 0 + index, ARRAYY_OPERATE['add']);
    //   })
    // });
    return data;
  }
  map() {
    return this.data.map(...arguments);
  }

}




class Objecty extends DataUnit {
  protected data: Object;
  private pushFunc: Function;
  private pullFunc: Function;

  constructor(data: Array<any>, pushFunc?: Function, pullFunc?: Function) {
    super(data);
    this.pushList = [];
    this.pushFunc = pushFunc;
    this.data = this.cpData(data);
    this.type = 'object';
  }

  cpData(data: Array<any>): Object {
    let _data = {}
    for (let i in data) {
      _data[i] = dataFactory(data[i]);
    }
    return _data;
  }
  getValues(...params) {
    const queue = [...params];
    log(queue);
    const _data = {};
    queue.forEach(item => {
      _data[item] = this.outputData(item);
    });
    log(_data);
    return _data;
  }

}





function dataFactory(data) {
  const type = testType(data);
  log(data, type);
  if (type === 'array') {
    return new Arrayy(data);
  } else if (type === 'object') {
    return new Objecty(data);
  } else {
    const _data = new DataUnit(data);
    log(_data);
    return _data;
  }
}

function checkNConvert(data) {
  const type = testType(data);
  if (type === 'object' || type === 'array') {
    return dataFactory(data);
  } else {
    return data;
  }
}

export { DataUnit, Arrayy, Objecty, dataFactory };