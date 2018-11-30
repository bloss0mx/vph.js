import { vdFactory, div, p, span, input, button, ul, li } from './vph'
import { interval } from 'rxjs';
import $ from 'jquery';
import moment from 'moment';


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
			time,
			input({
				onDirective: 'input.onInput'
			}),
			button({
				name: 'yo~',
				children: ['yo~'],
				onDirective: 'click.addToList',
			}),
			// div({
			// children: [
			li({
				children: ['{{x}}'],
				forDirective: 'x in todoList'
			}),
			// ]
			// })
		],
		attr: [],
		state: {
			todoList: [],
			inputText: '',
		},
		actions: {
			onInput(e) {
				const { inputText } = this.store.getValues('inputText');
				inputText.setData(e.target.value);
			},
			addToList() {
				const { inputText, todoList } = this.store.getValues('inputText', 'todoList');
				console.log(inputText);
				const value = inputText.outputData()
				todoList.push(value);
				inputText.setData('');
			}
		},
		whenInit() {
		}
	})
);
// vD1.store = { first: window.first };
const dom = vD1.giveDom();



setTimeout(() => {
	$('#app').append(dom);
}, 0);