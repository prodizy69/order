import { Component, OnInit, AfterContentChecked, ChangeDetectorRef } from '@angular/core';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-orderhistory',
  templateUrl: './orderhistory.component.html',
  styleUrls: ['./orderhistory.component.css']
})
export class OrderhistoryComponent implements OnInit, AfterContentChecked {
  contentLoading = true;
  noOrderDetail = false;
  serviceFailMessage = false;
  itemsPerPageCount = 10;
  pageNumber = 1;
  numberOfPages = 0;
  originalObj;
  orderHistoryResponse;
  detailsResponse: any;
  orderType = 'All orders';
  durationType;
  durationTypes = ['Past 1 month', 'Past 3 months', 'Past year'];
  pageSizeOptions = ['10', '20', '30', '40', 'Show all items'];
  filterType = 'Active';
  countConfig: any;
  itemsCount: number;
  constructor(
    private api: ApiService,
    private cdr: ChangeDetectorRef
  ) {
    this.getData();
  }

  ngOnInit() {

  }

  ngAfterContentChecked() {
    if (this.originalObj && this.originalObj.orderList && this.originalObj.orderList.order) {
      this.filter(this.filterType);
      const displayCount = this.itemsPerPageCount ? this.itemsPerPageCount : 10;
      this.orderHistoryResponse.orderList.order = this.orderHistoryResponse.orderList.order.slice(0, displayCount);
    }
  }

  getData() {
    this.orderHistoryResponse = { responseStatus: {}, orderList: { order: [] } };
    this.api.getDetails().subscribe((res: any) => {
      this.detailsResponse = res.json();
      this.api.getHistory().subscribe((response: any) => {
        this.orderHistoryResponse = response.json().getOrderHistoryListResponse;
        this.originalObj = JSON.parse(JSON.stringify(response.json().getOrderHistoryListResponse));
        this.getCounts();
        this.numberOfPages = this.orderHistoryResponse.orderList.numberOfOrders;
        this.orderHistoryResponse.orderList.order.forEach(element => {
          this.detailsResponse.forEach(detail => {
            element.details = detail.responseMap.details.shipToHomeItemInfo.shipments[0]['items'];
          });
        });

      });
    });
  }

  filter(type) {
    this.orderHistoryResponse.orderList.order = [];
    this.orderType = type;
    this.filterType = type;
    if (type === 'Active') {
      this.orderHistoryResponse.orderList.order =
        this.originalObj.orderList.order.filter(
          ord => ord.orderStatusDescription === 'Shipped' || ord.orderStatusDescription === 'Order Placed'
        );
      this.itemsCount = this.orderHistoryResponse.orderList.order.length;
    } else if (type === 'Product') {
      this.orderHistoryResponse.orderList.order =
        this.originalObj.orderList.order.filter(
          ord => ord.orderCode === 'Non Prescription'
        );
      this.itemsCount = this.orderHistoryResponse.orderList.order.length;
    } else if (type === 'Rx') {
      this.orderHistoryResponse.orderList.order =
        this.originalObj.orderList.order.filter(
          ord => ord.orderCode === 'Prescription'
        );
      this.itemsCount = this.orderHistoryResponse.orderList.order.length;
    } else {
      this.orderHistoryResponse.orderList.order =
        this.originalObj.orderList.order.filter(
          ord => ord.orderStatusDescription === type
        );
      this.itemsCount = this.orderHistoryResponse.orderList.order.length;
    }
    if (this.orderHistoryResponse && this.orderHistoryResponse.orderList && this.orderHistoryResponse.orderList.order) {
      this.orderHistoryResponse.orderList.order.forEach(order => {
        if (this.detailsResponse.length) {
          this.detailsResponse.forEach(function (res) {
            order.details = res.responseMap.details.shipToHomeItemInfo.shipments[0]['items'];
          });
        }
      });

    }
    this.cdr.detectChanges();
  }

  goToPage(i) {
    this.pageNumber = i;
    const count = this.itemsPerPageCount * i;
    this.orderHistoryResponse.orderList.order = this.originalObj.orderList.order.slice(count, (count + this.itemsPerPageCount));
  }

  getNumber(num) {
    return new Array(num);
  }

  getPagination() {
    console.log(Math.ceil(this.numberOfPages / this.itemsPerPageCount));
    return new Array(Math.ceil(this.numberOfPages / this.itemsPerPageCount));
  }

  displayData(event) {
    if (event.currentPage) {
      this.goToPage(event.currentPage);
    } else {
      this.itemsPerPageCount = event.size;
      console.log(event.size);
      if (this.orderHistoryResponse && this.orderHistoryResponse.orderList && this.orderHistoryResponse.orderList.order) {
        this.orderHistoryResponse.orderList.order = this.originalObj.orderList.order.slice(0, event.size);
      }
    }
  }

  getCounts() {
    const activeCount = this.originalObj.orderList.order.filter(
      ord => ord.orderStatusDescription === 'Shipped' || ord.orderStatusDescription === 'Order Placed'
    );
    const deliveredCount = this.originalObj.orderList.order.filter(
      ord => ord.orderStatusDescription === 'Delivered'
    );
    const cancelledCount = this.originalObj.orderList.order.filter(
      ord => ord.orderStatusDescription === 'Cancelled'
    );
    const productCount = this.originalObj.orderList.order.filter(
      ord => ord.orderCode === 'Non Prescription'
    );
    const rxCount =
      this.originalObj.orderList.order.filter(
        ord => ord.orderCode === 'Prescription'
      );
    this.countConfig = {
      active: activeCount.length,
      delivered: deliveredCount.length,
      cancelled: cancelledCount.length,
      product: productCount.length,
      rx: rxCount.length
    };
    return this.countConfig;
  }
}
