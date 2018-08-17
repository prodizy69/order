import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.css']
})
export class FiltersComponent implements OnChanges {
  @Input()
  durationTypes;

  @Output()
  filter = new EventEmitter<any>(true);

  durationType;
  orderType;
  constructor() {
    this.orderType = 'Active';
    this.durationType = '1';
  }


  ngOnChanges() {
  }

  applyFilters(orderType?) {
    if (orderType) {
      this.orderType = orderType;
    }
    let startDate;
    let endDate;
    if (this.durationType) {
      const date = new Date();
      const oldDate = moment().subtract(parseInt(this.durationType, 0), 'months');
      const pastDate = new Date(oldDate['_d']);
      startDate = pastDate.getFullYear() + '-' + this.pad(pastDate.getMonth() + 1) + '-' + this.pad(pastDate.getDate());
      endDate = date.getFullYear() + '-' + this.pad(date.getMonth() + 1) + '-' + this.pad(date.getDate());
    }
    this.filter.emit({ type: this.orderType, query: [{ value: startDate }, { value: endDate }] });
  }

  pad(val) {
    if (val < 10) {
      val = '0' + val;
      return val;
    } else {
      return val;
    }
  }
}
