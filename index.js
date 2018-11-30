import { vdFactory, tags, init } from './vph';
const { div, p, span, input, button, ol, ul, li } = tags;
import Time from './time-component';

init('#app', vdFactory(
	div({
		children: [
			Time,
			input({
				onDirective: 'input.onInput'
			}),
			button({
				children: ['Add to list'],
				onDirective: 'click.addToList',
			}),
			ol({
				children: [
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
				const value = inputText.outputData()
				todoList.push(value);
				inputText.setData('');
			}
		},
		whenInit() {
		}
	})
), true);