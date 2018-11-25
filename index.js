import { vdFactory, div, p, span, makeVd } from './vph'
import { interval } from 'rxjs';
import $ from 'jquery';
import moment from 'moment';


// var first = new DataUnit('hey');
// var second = new DataUnit(0);

// console.log(window.first.outputData());
const component1 = vdFactory(
	div({
		children: [
			'这是个组件：',
			'{{value}}',
			div({ children: ['那啥～～～～～～～～'], attr: ['style=color:{{color0}}'] }),
			div({ children: ['那啥～～～～～～～～'], attr: ['style=color:{{color1}}'] }),
			div({ children: ['那啥～～～～～～～～'], attr: ['style=color:{{color2}}'] }),
			div({
				children: ['那啥～～～～～～～～'],
				attr: ['style=color:{{color3}}'],
				ifDirective: 'switcher',
				// whenInit() {
				// 	interval(1333).subscribe({
				// 		next: item => {
				// 			this.ifDirective(item % 2);
				// 		}
				// 	});
				// }
			}),
			div({ children: ['那啥～～～～～～～～'], attr: ['style=color:{{color4}}'] }),
			div({ children: ['那啥～～～～～～～～'], attr: ['style=color:{{color5}}'] }),
			div({ children: ['那啥～～～～～～～～'], attr: ['style=color:{{color6}}'] }),
			div({ children: ['那啥～～～～～～～～'], attr: ['style=color:{{color7}}'] }),
		],
		state: {
			value: 0,
			color: 'red',
			color0: 'red',
			color1: 'red',
			color2: 'red',
			color3: 'red',
			color4: 'red',
			color5: 'red',
			color6: 'red',
			color7: 'red',
			switcher: 0,
		},
		attr: [
			'style=color:{{color}};font-size:30px'
		],
		actions: {
			interval() {
				const { value, color, color0, color1, color2, color3, color4, color5, color6, color7, switcher } = this.store.getValues('value', 'color', 'color0', 'color1', 'color2', 'color3', 'color4', 'color5', 'color6', 'color7', 'switcher');
				interval(1000).subscribe({
					next: item => {
						value.setData(item);
					}
				});
				interval(1000).subscribe({
					next: item => {
						switcher.setData(item % 333);
					}
				})
				interval(1000).subscribe({
					next: item => {
						color7.setData(color6.outputData());
						color6.setData(color5.outputData());
						color5.setData(color4.outputData());
						color4.setData(color3.outputData());
						color3.setData(color2.outputData());
						color2.setData(color1.outputData());
						color1.setData(color0.outputData());
						color0.setData(color.outputData());
						color.setData('#' + Math.floor(Math.random() * (parseInt('ffffff', 16))).toString(16));
					}
				})
			}
		},
		whenInit() {
			this.interval();
		}
	})
);

const time = vdFactory(
	p({
		children: [
			'现在时间：',
			'{{time}}'
		],
		state: {
			time: moment().format('YYYY-MM-DD HH:mm:ss'),
		},
		actions: {
			interval() {
				const { time } = this.store.getValues('time');
				interval(1000).subscribe({
					next: item => {
						const value = moment().format('YYYY-MM-DD HH:mm:ss');
						time.setData(value);
					}
				});
			}
		},
		whenInit() {
			this.interval();
		}
	})
);

window.vD1 = vdFactory(
	div({
		children: [
			component1,
			span({
				children: ['这一坨不变是二：'],
				attr: [],
			}),
			'{{second}}',
			div({
				children: ['这一坨是三：', '{{third}}', '不变'],
				attr: ['style=color:red']
			}),
			'这一坨是一：',
			'{{first}}',
			time,
		],
		attr: [],
		state: {
			array1: ['aye'],
			first: 0,
			second: 0,
			third: 3,
		},
		actions: {
			start() {
				const { array1 } = this.store.getValues('array1');
				setTimeout(() => {
					// console.log(array1.outputData(0));
				}, 200);
			},
			interval() {
				const { second, first, third } = this.store.getValues('second', 'first', 'third');
				interval(1000).subscribe({
					next: item => {
						first.setData(item);
						third.setData(item + 3);
					}
				});
				interval(1000).subscribe({
					next: item => {
						second.setData(item * 2);
					}
				});
			}
		},
		whenInit() {
			console.log(this);
			this.interval();
			this.start();
		}
	})
);
// vD1.store = { first: window.first };
const dom = vD1.giveDom();

// console.log(window.vD1);
// console.log(dom);


setTimeout(() => {
	$('#app').append(dom);
}, 0);
// setTimeout(() => {
// 	first.setData(0);
// }, 0);

// interval(1000).subscribe({
// 	next: item => {
// 		window.vD1.store.first.setData(item + 1);
// 		// console.log('++');
// 	}
// });
