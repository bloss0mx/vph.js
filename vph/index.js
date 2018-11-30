import { testType, log } from './utils';
import _ from 'lodash';
import $ from 'jquery';
import VirtualDom from './vdom';
import { forDirective } from './directive';





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
export function input(init) {
  init.tag = 'input';
  init.children = undefined;
  return init;
}
export function button(init) {
  init.tag = 'button';
  return init;
}
export function ul(init) {
  init.tag = 'ul';
  return init;
}
export function li(init) {
  init.tag = 'li';
  return init;
}