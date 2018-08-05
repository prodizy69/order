import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';

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
    this.durationType = 'Past 1 month';
  }


  ngOnChanges() {
    console.log(this.durationTypes);
  }
  filtering(type) {
    this.orderType = type;
    this.filter.emit(type);
  }
}
