import { vdFactory, tags, init } from '../vph';
const { div, p, span, input, button, ul, li } = tags;
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

export default time;