import { Component } from '@angular/core';
import { Input, Output, EventEmitter, OnChanges } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent implements OnChanges {

  pageSize = 10;
  @Input()
  dataSize;

  currentPage;
  pagination;
  noOfPages: number;

  @Output()
  dataChange = new EventEmitter<any>();
  constructor() {
    this.currentPage = 1;
    this.noOfPages = 1;
    this.pagination = new Array(this.noOfPages);
  }

  ngOnChanges() {
    if (this.dataSize) {
      this.noOfPages = Math.ceil(this.dataSize / this.pageSize);
      this.pagination = new Array(this.noOfPages);
      this.dataChange.emit({ size: this.pageSize });
    }
  }

  reArrange() {
    if (this.pageSize) {
      this.noOfPages = Math.ceil(this.dataSize / this.pageSize);
      this.pagination = new Array(this.noOfPages);
      this.dataChange.emit({ size: this.pageSize });
    }
  }
  goToPage(index) {
    this.currentPage = index + 1;
    this.dataChange.emit({ currentPage: this.currentPage });
  }

  left() {
    this.currentPage = this.currentPage - 1;
  }

  right() {
    this.currentPage = this.currentPage + 1;
  }

}
