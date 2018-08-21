import { UtilityService } from './../services/utility.service';
import { Component, OnInit, AfterContentChecked, ChangeDetectorRef } from '@angular/core';
import { ApiService } from '../services/api.service';
import { trackingUrls } from './order-history.constants';

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
  durationTypes = [{ label: 'Past 1 month', value: 1 }, { label: 'Past 3 months', value: 3 },
  { label: 'Past 6 months', value: 6 }, { label: 'Past 12 months', value: 12 }];
  pageSizeOptions = ['10', '20', '30', '40', 'Show all items'];
  filterType = 'Active';
  countConfig: any;
  itemsCount: number;
  showSpinner = false;
  trackingUrls = trackingUrls;
  constructor(
    private api: ApiService,
    private cdr: ChangeDetectorRef,
    private utilityService: UtilityService
  ) {
    this.getData();
  }

  ngOnInit() {
    console.log(this.utilityService.CONFIG.microservices.history.url);
    //this._sendTag('pageLoad');


  }


  ngAfterContentChecked() {
    if (this.originalObj && this.originalObj.orderList && this.originalObj.orderList.order) {
      this.filter({ type: this.filterType });
      const displayCount = this.itemsPerPageCount ? this.itemsPerPageCount : 10;
      this.orderHistoryResponse.orderList.order = this.orderHistoryResponse.orderList.order.slice(0, displayCount);
    }
  }

  getData() {
    this.orderHistoryResponse = { responseStatus: {}, orderList: { order: [] } };
    this.api.getDetails().subscribe((res: any) => {
      this.detailsResponse = res.json();
      this.api.getHistory().subscribe((response: any) => {
        const data = response.json();
        this.orderHistoryResponse = data.getOrderHistoryListResponse;
        this.originalObj = response.json().getOrderHistoryListResponse;
        this.numberOfPages = this.orderHistoryResponse.orderList.numberOfOrders;
      });
    });
  }

  filter(type) {
    this.orderHistoryResponse.orderList.order = [];
    this.orderType = type.type;
    this.filterType = type.type;
    if (type.type === 'Active') {
      this.orderHistoryResponse.orderList.order =
        this.originalObj.orderList.order.filter(
          ord => (!ord.CarePass && ord.orderStatusDescription === 'Order Placed') || ord.orderStatusDescription === 'Shipped'
        );
    } else if (type.type === 'CarePass') {
      this.orderHistoryResponse.orderList.order =
        this.originalObj.orderList.order.filter(
          ord => ord.CarePass === true
        );
    } else if (type.type === 'Delivered') {
      this.orderHistoryResponse.orderList.order =
        this.originalObj.orderList.order.filter(
          ord => ord.orderStatusDescription === 'Delivered' || ord.orderStatusDescription === 'Return completed'
        );
    } else {
      this.orderHistoryResponse.orderList.order =
        this.originalObj.orderList.order.filter(
          ord => ord.orderStatusDescription === type.type
        );
    }
    if (this.orderHistoryResponse && this.orderHistoryResponse.orderList && this.orderHistoryResponse.orderList.order) {
      this.orderHistoryResponse.orderList.order.forEach(element => {
        const details = [];
        this.detailsResponse.forEach(det => {
          if (element.orderIdentifier.identificationIdentifier === det.responseMap.details.externalId) {
            if (det.responseMap.details.shipToHomeItemInfo.shipments[0].trackingDetails.length) {
              det.responseMap.details.shipToHomeItemInfo.shipments[0].trackingDetails.forEach((track, index) => {
                details[index] = JSON.parse(JSON.stringify(
                  det.responseMap.details.shipToHomeItemInfo.shipments[0].trackingDetails[index]));
                if (track.ItemID instanceof Array) {
                  track.ItemID.forEach(item => {
                    det.responseMap.details.shipToHomeItemInfo.shipments[0].items.forEach(info => {
                      if (item === info.skuId) {
                        if (details[index]['items']) {
                          details[index]['items'].push(info);
                        } else {
                          details[index]['items'] = [info];
                        }
                      }
                    });
                  });
                } else {
                  det.responseMap.details.shipToHomeItemInfo.shipments[0].items.forEach(info => {
                    if (track.ItemID === info.skuId) {
                      if (details[index]['items']) {
                        details[index]['items'].push(info);
                      } else {
                        details[index]['items'] = [info];
                      }
                    }
                  });
                }
              });
            } else {
              const obj = { items: det.responseMap.details.shipToHomeItemInfo.shipments[0].items };
              details.push(JSON.parse(JSON.stringify(obj)));
            }
          }
        });
        element.details = JSON.parse(JSON.stringify(details));
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

  goToDetails(id) {
    if (id) {
      const url =
        'https://www-qa3.cvs.com/account/order-status-and-history.jsp?itemsrange=' + this.itemsPerPageCount + '&viewall=all&duration=3#/' + id;
      window.open(url, '_self');
    }
  }

  goToWebsite(data) {
    console.log('url', window.location.hostname + data.seoSlug);
    window.open(window.location.hostname + data.seoSlug, '_blank');
  }

  // private _sendTag(tagType) {
  //       this.fieldErrorArray = this.alertLink.length > 0 ? [...this.alertLink] : [];
  //       const sections = this._tagService.getSubSections();
  //       if (tagType === 'pageLoad') {
  //           this._tagService.view(null, {
  //               page_name: 'order status and history',
  //                 });
  //       } else if (tagType === 'continue' && this.showAddPayment) {

  //           this._tagService.link(null, {
  //               link_name: 'custom:order status and history: order details'
  //           });
  //       }
  //       else if (tagType == 'continue') {
  //           this._tagService.link(null, {
  //               link_name: 'custom:order status and history: track package'
  //               });
  //       }

  //   }

}
