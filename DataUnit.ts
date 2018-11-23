import { testType } from './utils';
import _ from 'lodash';

class DataUnit {
  protected data: any;
  protected pushList: Array<any>;
  protected pullList: Array<any>;
  protected type: String;

  constructor(data: any) {
    this.data = data;
    this.pushList = [];
    this.pullList = [];
    this.type = testType(data);
  }

  addPush(pushOrigin) {
    this.pushList.push(pushOrigin);
  }
  addPull(pullOrigin) {
    this.pullList.push(pullOrigin);
  }
  rmPush(pushOrigin) {
    this.pushList = _.difference(this.pushList, [pushOrigin]);
  }
  rmPull(pullOrigin) {
    this.pullList = _.difference(this.pullList, [pullOrigin]);
  }
  outputData(index?: number): any {
    // console.log('====>', index, this.data);
    if (index === undefined && this.type === 'array') {
      console.log(this.data);
      return this.data.map(item => {
        return item.outputData();
      });
    } else if (index === undefined && this.type === 'object') {
      let _data = {};
      for (let i in this.data) {
        _data[i] = this.data[i].outputData();
      }
      return _data;
    } else if (index !== undefined && (this.type === 'array' || this.type === 'object')) {
      return this.data[index].outputData();
    } else {
      return this.data;
    }
  }
  setData(data, name?: (number | string)) {
    if (this.type === 'object' && name) {
      this.data[name].setData(data);
    } else if (this.type === 'array' && name) {
      this.data[name].setData(data);
    } else {
      this.data = data;
      this.pushList.map((item, index) => {
        item.run && item.run(this.data, this.type, index);
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
    this.pullList = [];
    this.pushFunc = pushFunc;
    this.pullFunc = pullFunc;
    console.log(data);
    this.data = this.cpData(data);
    console.log(this.data);
    this.type = 'array';
  }

  dataFilter(data): (DataUnit | Arrayy | Objecty) {
    const type = testType(data);
    console.log(data);
    if (type === 'array') {
      return new Arrayy(data, this.pushFunc, this.pullFunc);
    } else if (type === 'object') {
      return new Objecty(data, this.pushFunc, this.pullFunc);
    } else {
      return new DataUnit(data);
    }
  }
  cpData(data: Array<any>): Array<DataUnit> {
    const _data = data.map((item, index) => this.dataFilter(item));
    return _data;
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
  }
  pop() {
    const _data = this.difference(this.data.length, 1)
    this.data = _.difference(this.data, _data);
    return _data;
  }
  unshift() {
    this.data = this.splice(0, 0, ...arguments);
  }
  shift() {
    const _data = this.difference(0, 1)
    this.data = _.difference(this.data, _data);
    return _data;
  }
  slice(index: number, len: number) {
    return this.difference(index, len);
  }

}




class Objecty extends DataUnit {
  protected data: Array<any>;
  private pushFunc: Function;
  private pullFunc: Function;

  constructor(data: Array<any>, pushFunc?: Function, pullFunc?: Function) {
    super(data);
    this.pushList = [];
    this.pullList = [];
    this.pushFunc = pushFunc;
    this.pullFunc = pullFunc;
    this.data = this.cpData(data);
    this.type = 'object';
  }

  cpData(data: Array<any>): Array<DataUnit> {
    let _data = {}
    for (let i in data) {
      _data[i] = this.dataFilter(data[i]);
    }
    return data;
  }
  dataFilter(data) {
    console.log('dataFileter');
    const type = testType(data);
    if (type === 'array') {
      return new Arrayy(data, this.pushFunc, this.pullFunc);
    } else if (type === 'object') {
      console.log(data);
      return new Objecty(data, this.pushFunc, this.pullFunc);
    } else {
      return new DataUnit(data);
    }
  }
}





function dataFactory(data) {
  const type = testType(data);
  if (type === 'array') {
    console.log(data);
    return new Arrayy(data);
  } else if (type === 'object') {
    return new Objecty(data);
  } else {
    return new DataUnit(data);
  }
}

export { DataUnit, Arrayy, dataFactory };