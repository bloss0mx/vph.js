import { testType, log } from './utils';
import _ from 'lodash';
import $ from 'jquery';
import { DataUnit, Arrayy, dataFactory } from './DataUnit';
import VirtualDom from './vdom';





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