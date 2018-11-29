import { vdFactory, div, p, span, For } from './vph'
import { interval } from 'rxjs';
import $ from 'jquery';
import moment from 'moment';



const component1 = vdFactory(
	div({
		children: [
			'这是个组件：',
			'{{value.index}}',
			div({ children: ['{{color0}}'], attr: ['style=color:{{color0}}'] }),
			div({ children: ['{{color1}}'], attr: ['style=color:{{color1}}'] }),
			div({ children: ['{{color2}}'], attr: ['style=color:{{color2}}'] }),
			div({
				children: [
					'{{color3}}',
					div({
						children: ['{{color3}}'],
						attr: ['style=color:{{color3}}']
					})
				],
				attr: ['style=color:{{color3}}'],
				ifDirective: 'switcher',
				key: 1,
				// whenInit() {
				// 	interval(1333).subscribe({
				// 		next: item => {
				// 			this.ifDirective(item % 2);
				// 		}
				// 	});
				// }
			}),
			div({ children: ['{{color4}}'], attr: ['style=color:{{color4}}'] }),
			div({ children: ['{{color5}}'], attr: ['style=color:{{color5}}'] }),
			div({ children: ['{{color6}}'], attr: ['style=color:{{color6}}'] }),
			div({ children: ['{{color7}}'], attr: ['style=color:{{color7}}'] }),
		],
		state: {
			value: { index: 0 },
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
				interval(100).subscribe({
					next: item => {
						value.outputData('index').setData(item);
					}
				});
				interval(100).subscribe({
					next: item => {
						switcher.setData(item % 2);
					}
				})
				interval(100).subscribe({
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
	div({
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
			div({
				children: ['=>', '{{x}}', '后面也框起来'],
				forDirective: 'x in array1'
			}),
			time,
		],
		attr: [],
		state: {
			array1: ['array1', 'array2', 'array3', 'array4', 'array5'],
			first: 0,
			second: 0,
			third: 3,
		},
		actions: {
			start() {
				const { array1 } = this.store.getValues('array1');
				setInterval(() => {
					array1.setData(Math.floor(Math.random() * 100), 1);
				}, 100);
			},
			interval() {
				const { second, first, third } = this.store.getValues('second', 'first', 'third');
				interval(100).subscribe({
					next: item => {
						first.setData(item);
						third.setData(item + 3);
					}
				});
				interval(100).subscribe({
					next: item => {
						second.setData(item * 2);
					}
				});
			}
		},
		whenInit() {
			this.interval();
			this.start();
		}
	})
);
// vD1.store = { first: window.first };
const dom = vD1.giveDom();



setTimeout(() => {
	$('#app').append(dom);
}, 0);
// setTimeout(() => {
// 	first.setData(0);
// }, 0);

// interval(1000).subscribe({
// 	next: item => {
// 		window.vD1.store.first.setData(item + 1);
// 	}
// });
