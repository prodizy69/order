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
  constructor(
    private api: ApiService,
    private cdr: ChangeDetectorRef
  ) {
  }

  ngOnInit() {
    this.getData();
  }

  ngAfterContentChecked() {
    if (this.originalObj && this.originalObj.orderList && this.originalObj.orderList.order) {
      console.log('calling....');
      this.filter(this.filterType);
      this.orderHistoryResponse.orderList.order = this.orderHistoryResponse.orderList.order.slice(0, 10);
    }
  }

  getData() {
    this.orderHistoryResponse = { responseStatus: {}, orderList: { order: [] } };
    this.api.getDetails().subscribe((res: any) => {
      this.detailsResponse = res;
      this.api.getHistory().subscribe((response: any) => {
        this.orderHistoryResponse = response.getOrderHistoryListResponse;
        this.originalObj = JSON.parse(JSON.stringify(response.getOrderHistoryListResponse));
        this.numberOfPages = this.orderHistoryResponse.orderList.numberOfOrders;
        this.orderHistoryResponse.orderList.order.forEach(element => {
          this.detailsResponse.forEach(detail => {
            // if (detail.responseMap.details.externalId === element.orderIdentifier.identificationIdentifier) {
            element.details = detail.responseMap.details.shipToHomeItemInfo.shipments[0]['items'];
            // }
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

    } else if (type === 'Product') {
      this.orderHistoryResponse.orderList.order =
        this.originalObj.orderList.order.filter(
          ord => ord.orderCode === 'Non Prescription'
        );

    } else if (type === 'Rx') {
      this.orderHistoryResponse.orderList.order =
        this.originalObj.orderList.order.filter(
          ord => ord.orderCode === 'Prescription'
        );

    } else {
      this.orderHistoryResponse.orderList.order =
        this.originalObj.orderList.order.filter(
          ord => ord.orderStatusDescription === type
        );

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
      if (this.orderHistoryResponse && this.orderHistoryResponse.orderList && this.orderHistoryResponse.orderList.order) {
        this.orderHistoryResponse.orderList.order = this.originalObj.orderList.order.slice(0, event.size);
      }
    }
  }
}
