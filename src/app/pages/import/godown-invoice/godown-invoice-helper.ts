import {ApiService, ToastService, UtilService} from "../../../services";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {PrintService} from "../../../services/print.service";
import {ChangeDetectorRef, inject, signal} from "@angular/core";
import {API, CHARGE_CODE, CHARGE_TYPE} from "../../../lib";
import {GODOWN_INVOICE_DATA} from "./godown-invoice-data";

export class GodownInvoiceHelper {
  apiService = inject(ApiService);
  utilService = inject(UtilService)
  toasterService = inject(ToastService);
  modalService = inject(NgbModal);
  printService = inject(PrintService);
  cdr = inject(ChangeDetectorRef);

  readonly apiUrls = API.IMPORT.GODOWN_INVOICE;
  readonly invoiceTypes = GODOWN_INVOICE_DATA.invoiceTypes;

  eximTraderMap = signal<Map<number, any>>(new Map());
  partyList = signal<any[]>([]);
  applicationList = signal<any[]>([])
  oblList = signal<any[]>([]);
  allChargeTypes = signal<any[]>([]);

  getDeliveryApplicationList () {
    this.apiService.get(this.apiUrls.APPLICATION_LIST, {isInvoiceCheck: true}).subscribe({
      next: (response: any) => {
        this.applicationList.set(response.data)
      }
    })
  }

  getOblList(deliveryId: number) {
    this.apiService.get(this.apiUrls.OBL_CONTAINER_LIST, {DeliveryId: deliveryId}).subscribe({
      next: (response: any) => {
        this.oblList.set(response.data)
      }
    })
  }

  getPartyList() {
    this.apiService.get(API.MASTER.PARTY.LIST).subscribe({
      next: (response: any) => {
        this.partyList.set(response.data)
      }
    })
  }

  getEximTraderList() {
    this.apiService.get(API.MASTER.EXIM_TRADER.LIST).subscribe({
      next: (response: any) => {
        const eximTraderMap = new Map<number, any>();
        response.data.forEach((eximTrader: any) => {
          eximTraderMap.set(eximTrader.traderId, eximTrader);
        })
        this.eximTraderMap.set(eximTraderMap)
      }
    })
  }

  getChargeTypeList(){
    this.apiService.get(API.IMPORT.YARD_INVOICE.CHARGE_TYPE).subscribe({
      next: (response: any) => {
        this.allChargeTypes.set(response.data)
      }
    })
  }

  getFetchInsuranceChargesPayload(partyId: number, selectedContainerList: any[]) {
    if(!partyId || !selectedContainerList.length) {
      return;
    }
    const containerList = selectedContainerList.reduce((acc: any, container: any) => {
      if(!container.isInsured) {
        if(acc.length > 0) {
          acc += ",";
        }
        acc += this.getContainerOblNo(container);
      }
      return acc;
    }, "")
    if(!containerList) {
      return;
    }
    return { containerList: containerList, partyId, typeOfCharge: CHARGE_TYPE.IMPORT }
  }

  getFetchChargesPayload(partyId: number, selectedContainerList: any[]) {
    if(!partyId || !selectedContainerList.length) {
      return;
    }
    const containerOblList = selectedContainerList.reduce((acc: any, container: any, index: number) => {
      acc += this.getContainerOblNo(container);
      if(index !== selectedContainerList.length - 1) {
        acc += ",";
      }
      return acc;
    }, "")
    return { containerOBLList: containerOblList, partyId, typeOfCharge: CHARGE_TYPE.IMPORT }
  }

  getTotalCharges(importCharges: any, storageCharges: any, insuranceCharges: any) {
    if(!importCharges) {
      return {}
    }
    const total = (importCharges.totalEntryAmt ?? 0) + (storageCharges.totalAmt ?? 0) + (insuranceCharges.totalAmt ?? 0);
    const totalInvoice = Math.ceil(total);
    const added = totalInvoice - total;
    return { total, totalInvoice, added }
  }

  getContainerOblNo(container: any) {
    return `${container.containerNo}#${container.obl}`;
  }

  makePayload(value: any, chargeDetails: any, storageChargeDetails: any,insuranceChargeDetails: any, selectedContainerList: any[], partyList: any[]) {
    const isTaxInvoice = value.invoiceType == 1;
    const isFactoryDestuffing = value.destuffingType;
    const entChargeDetails = this.allChargeTypes().find(chargeType => chargeType.chargeCode === CHARGE_CODE.ENTRY);
    const stoChargeDetails = this.allChargeTypes().find(chargeType => chargeType.chargeCode === CHARGE_CODE.STORAGE);
    const insChargeDetails = this.allChargeTypes().find(chargeType => chargeType.chargeCode === CHARGE_CODE.INSURANCE);
    const totalPackages = selectedContainerList.reduce((acc: number, container: any) => container.noOfPackages + acc, 0);
    const totalWeight = selectedContainerList.reduce((acc: number, container: any) => container.grossWt + acc, 0);
    const rate = +(totalWeight / totalPackages).toFixed(2);
    return {
      ...value,
      isTaxInvoice: isTaxInvoice,
      isBillOfSupply: !isTaxInvoice,
      factoryDestuffing: isFactoryDestuffing,
      directDestuffing: !isFactoryDestuffing,
      deliveryDate: this.utilService.getDateObject(value.deliveryDate),
      invoiceDate: this.utilService.getDateObject(value.invoiceDate),
      payeeName: partyList.find(party => party.partyId === value.payeeId)?.partyName,
      partyName: partyList.find(party => party.partyId === value.partyId)?.partyName,
      isImport: true,
      jsonData: JSON.stringify([
        {
          "ChargesTypeId": entChargeDetails?.chargeId,
          "OperationId": 0,
          "Clause": "",
          "ChargeType": entChargeDetails?.chargeCode,
          "ChargeName": entChargeDetails?.chargeName,
          "Quantity": totalPackages,
          "Rate": rate,
          "Amount": chargeDetails.totalEntryValue,
          "Discount": 0,
          "Taxable": chargeDetails.totalEntryValue,
          "IGSTPer": chargeDetails.igsTper,
          "IGSTAmt": chargeDetails.entryIGSTAmount,
          "CGSTPer": chargeDetails.cgsTper,
          "CGSTAmt": chargeDetails.entryCGSTAmount,
          "SGSTPer": chargeDetails.sgsTper,
          "SGSTAmt": chargeDetails.entrySGSTAmount,
          "Total": chargeDetails.totalEntryAmt,
          "SACCode": chargeDetails.entrySacCode,
        },
        {
          "ChargesTypeId": stoChargeDetails?.chargeId,
          "OperationId": 0,
          "Clause": "",
          "ChargeType": stoChargeDetails?.chargeCode,
          "ChargeName": stoChargeDetails?.chargeName,
          "Quantity": totalPackages,
          "Rate": rate,
          "Amount": storageChargeDetails.totalStorageChargevalue,
          "Discount": 0,
          "Taxable": storageChargeDetails.totalStorageChargevalue,
          "IGSTPer": storageChargeDetails.igst,
          "IGSTAmt": storageChargeDetails.igstAmount,
          "CGSTPer": storageChargeDetails.cgst,
          "CGSTAmt": storageChargeDetails.cgstAmount,
          "SGSTPer": storageChargeDetails.sgst,
          "SGSTAmt": storageChargeDetails.sgstAmount,
          "Total": storageChargeDetails.totalAmt,
          "SACCode": storageChargeDetails.sacCode,
        },
        {
          "ChargesTypeId": insChargeDetails?.chargeId,
          "OperationId": 0,
          "Clause": "",
          "ChargeType": insChargeDetails?.chargeCode,
          "ChargeName": insChargeDetails?.chargeName,
          "Quantity": totalPackages,
          "Rate": rate,
          "Amount": insuranceChargeDetails.totalInsuranceValue,
          "Discount": 0,
          "Taxable": insuranceChargeDetails.totalInsuranceValue,
          "IGSTPer": insuranceChargeDetails.igst,
          "IGSTAmt": insuranceChargeDetails.igstAmount,
          "CGSTPer": insuranceChargeDetails.cgst,
          "CGSTAmt": insuranceChargeDetails.cgstAmount,
          "SGSTPer": insuranceChargeDetails.sgst,
          "SGSTAmt": insuranceChargeDetails.sgstAmount,
          "Total": insuranceChargeDetails.totalAmt,
          "SACCode": insuranceChargeDetails.sacCode,
        }
      ])
    };
  }
}
