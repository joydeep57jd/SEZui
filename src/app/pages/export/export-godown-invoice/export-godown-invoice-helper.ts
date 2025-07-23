import {ApiService, ToastService, UtilService} from "../../../services";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {PrintService} from "../../../services/print.service";
import {ChangeDetectorRef, inject, signal} from "@angular/core";
import {API, CHARGE_CODE} from "../../../lib";
import {EXPORT_GODOWN_INVOICE_DATA} from "./export-godown-invoice-data";
import {firstValueFrom, forkJoin} from "rxjs";

export class ExportGodownInvoiceHelper {
  apiService = inject(ApiService);
  utilService = inject(UtilService)
  toasterService = inject(ToastService);
  modalService = inject(NgbModal);
  printService = inject(PrintService);
  cdr = inject(ChangeDetectorRef);

  readonly apiUrls = API.EXPORT.GODOWN_INVOICE;
  readonly invoiceTypes = EXPORT_GODOWN_INVOICE_DATA.invoiceTypes;

  eximTraderMap = signal<Map<number, any>>(new Map());
  partyList = signal<any[]>([]);
  applicationList = signal<any[]>([])
  shippingBillList = signal<any[]>([]);
  allChargeTypes = signal<any[]>([]);

  getContainerStuffingList () {
    this.apiService.get(this.apiUrls.APPLICATION_LIST, {isInvoiceCheck: true}).subscribe({
      next: (response: any) => {
        this.applicationList.set(response.data)
      }
    })
  }

  getShippingList(stuffingReqId: number) {
    this.apiService.get(this.apiUrls.SHIPPING_CONTAINER_LIST, {StuffingId: stuffingReqId}).subscribe({
      next: (response: any) => {
        this.shippingBillList.set(response.data)
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
      if(!container.insured) {
        if(acc.length > 0) {
          acc += ",";
        }
        acc += container.containerNo;
      }
      return acc;
    }, "")
    if(!containerList) {
      return;
    }
    return { containerList: containerList, partyId }
  }

  getEntryChargesPayload(partyId: number, selectedContainerList: any[]) {
    if(!partyId || !selectedContainerList.length) {
      return;
    }
    const containerOblList = selectedContainerList.reduce((acc: any, container: any, index: number) => {
      acc += container.containerNo;
      if(index !== selectedContainerList.length - 1) {
        acc += ",";
      }
      return acc;
    }, "")
    return { containerList: containerOblList, partyId }
  }

  getHandlingChargesPayload(partyId: number, selectedContainerList: any[]) {
    if(!partyId || !selectedContainerList.length) {
      return;
    }
    const containerOblList = selectedContainerList.reduce((acc: any, container: any, index: number) => {
      acc += this.getContainerSBNo(container);
      if(index !== selectedContainerList.length - 1) {
        acc += ",";
      }
      return acc;
    }, "")
    return { ContainerShLineList: containerOblList, partyId }
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

  getContainerSBNo(container: any) {
    return `${container.containerNo}#${container.shippingBillNo}`;
  }

  async makePayload(value: any, chargeDetails: any, handlingChargeDetails: any,insuranceChargeDetails: any, selectedContainerList: any[], partyList: any[]) {
    const isTaxInvoice = value.invoiceType == 1;
    const isFactoryDestuffing = value.destuffingType;
    const entChargeDetails = this.allChargeTypes().find(chargeType => chargeType.chargeCode === CHARGE_CODE.ENTRY);
    const hanChargeDetails = this.allChargeTypes().find(chargeType => chargeType.chargeCode === CHARGE_CODE.HANDLING);
    const insChargeDetails = this.allChargeTypes().find(chargeType => chargeType.chargeCode === CHARGE_CODE.INSURANCE);
    const totalPackages = selectedContainerList.reduce((acc: number, container: any) => container.noOfPackages + acc, 0);

    const rateApis = [
      this.apiService.get(API.CHARGE_RATE, {chargeType: CHARGE_CODE.ENTRY, sacCode: chargeDetails.entrySacCode, isImport: 'Export', ishigh: true}),
      this.apiService.get(API.CHARGE_RATE, {chargeType: CHARGE_CODE.HANDLING, sacCode: handlingChargeDetails.sacCode, isImport: 'Export', ishigh: true}),
    ]

    if(Object.keys(insuranceChargeDetails).length) {
      rateApis.push(
        this.apiService.get(API.CHARGE_RATE, {chargeType: CHARGE_CODE.INSURANCE, sacCode: insuranceChargeDetails.sacCode, isImport: 'Export', ishigh: true})
      )
    }

    const res: any[] = await firstValueFrom(forkJoin(rateApis))

    const jsonData = [
      {
        "ChargesTypeId": entChargeDetails?.chargeId,
        "OperationId": 0,
        "Clause": "",
        "ChargeType": entChargeDetails?.chargeCode,
        "ChargeName": entChargeDetails?.chargeName,
        "Quantity": totalPackages,
        "Rate": res[0].data.rate,
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
        "ChargesTypeId": hanChargeDetails?.chargeId,
        "OperationId": 0,
        "Clause": "",
        "ChargeType": hanChargeDetails?.chargeCode,
        "ChargeName": hanChargeDetails?.chargeName,
        "Quantity": totalPackages,
        "Rate": res[1].data.rate,
        "Amount": handlingChargeDetails.totalValue,
        "Discount": 0,
        "Taxable": handlingChargeDetails.totalValue,
        "IGSTPer": handlingChargeDetails.igst,
        "IGSTAmt": handlingChargeDetails.igstAmount,
        "CGSTPer": handlingChargeDetails.cgst,
        "CGSTAmt": handlingChargeDetails.cgstAmount,
        "SGSTPer": handlingChargeDetails.sgst,
        "SGSTAmt": handlingChargeDetails.sgstAmount,
        "Total": handlingChargeDetails.totalAmt,
        "SACCode": handlingChargeDetails.sacCode,
      }
    ];

    if(Object.keys(insuranceChargeDetails).length) {
      jsonData.push(
        {
          "ChargesTypeId": insChargeDetails?.chargeId,
          "OperationId": 0,
          "Clause": "",
          "ChargeType": insChargeDetails?.chargeCode,
          "ChargeName": insChargeDetails?.chargeName,
          "Quantity": totalPackages,
          "Rate": res[2].data.rate,
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
      )
    }
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
      isImport: false,
      jsonData: JSON.stringify(jsonData)
    };
  }
}
