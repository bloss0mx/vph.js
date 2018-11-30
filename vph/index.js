import { testType, log } from './utils';
import _ from 'lodash';
import $ from 'jquery';
import VirtualDom from './vdom';
import { forDirective } from './directive';
import { TAGS } from './constant';

const _tags = {};

TAGS.split(',').map(item => {
  _tags[item] = function (init) {
    init.tag = item;
    return init;
  }
});

export const tags = _tags;

export function vdFactory(init) {
  return new VirtualDom(init);
}

// export function div(init) {
//   init.tag = 'div';
//   return init;
// }
// export function p(init) {
//   init.tag = 'p';
//   return init;
// }
// export function span(init) {
//   init.tag = 'span';
//   return init;
// }
// export function input(init) {
//   init.tag = 'input';
//   init.children = undefined;
//   return init;
// }
// export function button(init) {
//   init.tag = 'button';
//   return init;
// }
// export function ul(init) {
//   init.tag = 'ul';
//   return init;
// }
// export function li(init) {
//   init.tag = 'li';
//   return init;
// }