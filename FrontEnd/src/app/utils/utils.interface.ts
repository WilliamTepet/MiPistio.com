import * as moment from 'moment';
import { FormControl } from '@angular/forms';

export function dateChangeValidator($event, control: FormControl) {
    let value = $event.targetElement.value;
      if (value === '') {
        control.setErrors(null);
      } else if (/^[0-9]{1,2}\/[0-9]{1,2}\/[0-9]{1,4}$/.test(value)) {
        if (moment(value, "DD/MM/YYYY").isValid()) {
          control.setErrors(null);
          let date: Date = control.value.toDate();
          date.setHours(0,0,0,0);
          if (date > new Date()) {
            control.setErrors({matDatepickerMax:true});
          }
          if (date < new Date(1900,0,1)) {
            control.setErrors({matDatepickerMin:true});
          }
        } else {
          control.setErrors({matDatepickerParse:true});  
        }
      } else {
        control.setErrors({matDatepickerParse:true});
      }
  }