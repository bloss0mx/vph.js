import { vdFactory, tags } from './vph';
const { div, p, span, input, button, ul, li } = tags;
import { interval } from 'rxjs';
import $ from 'jquery';
import moment from 'moment';
import Time from './time-component';

window.vD1 = vdFactory(
	div({
		children: [
			Time,
			input({
				onDirective: 'input.onInput'
			}),
			button({
				name: 'yo~',
				children: ['yo~'],
				onDirective: 'click.addToList',
			}),
			ul({
				children: [
					// li({
					// 	children: ['hey'],
					// }),
					li({
						children: ['{{x}}'],
						forDirective: 'x in todoList'
					}),
				]
			}),
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