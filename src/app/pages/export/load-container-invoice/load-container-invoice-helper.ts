import {ChangeDetectorRef, inject, signal} from "@angular/core";
import {ApiService, ToastService, UtilService} from "../../../services";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {PrintService} from "../../../services/print.service";
import {API, CHARGE_CODE, CHARGE_TYPE} from "../../../lib";
import {LOAD_CONTAINER_INVOICE_DATA} from "./load-container-invoice-data";

export class LoadContainerInvoiceHelper {
  apiService = inject(ApiService);
  utilService = inject(UtilService)
  toasterService = inject(ToastService);
  modalService = inject(NgbModal);
  printService = inject(PrintService);
  cdr = inject(ChangeDetectorRef);

  readonly apiUrls = API.EXPORT.LOAD_CONTAINER_INVOICE;
  readonly invoiceTypes = LOAD_CONTAINER_INVOICE_DATA.invoiceTypes;
  readonly sezTypes = LOAD_CONTAINER_INVOICE_DATA.sezTypes;

  eximTraderMap = signal<Map<number, any>>(new Map());
  partyList = signal<any[]>([]);
  containerList = signal<any[]>([]);
  containerRequestList = signal<any[]>([]);
  allChargeTypes = signal<any[]>([]);
  portList = signal<any[]>([]);

  getContainerList(requestNo: string) {
    this.apiService.get(this.apiUrls.CONTAINER_LIST, {RequestNo: requestNo}).subscribe({
      next: (response: any) => {
        this.containerList.set(response.data)
      }
    })
  }

  getContainerRequestList() {
    this.apiService.get(this.apiUrls.CONTAINER_LIST).subscribe({
      next: (response: any) => {
        this.containerRequestList.set(response.data)
      }
    })
  }

  getPortList() {
    this.apiService.get(API.MASTER.PORT.LIST).subscribe({
      next: (response: any) => {
        this.portList.set(response.data)
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
    const containerList = selectedContainerList.reduce((acc: any, container: any, index: number) => {
      if(!container.isInsured) {
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
    return { containerList: containerList, partyId, typeOfCharge: CHARGE_TYPE.IMPORT }
  }

  getFetchChargesPayload(partyId: number, selectedContainerList: any[]) {
    if(!partyId || !selectedContainerList.length) {
      return;
    }
    const containerList = selectedContainerList.reduce((acc: any, container: any, index: number) => {
      acc += container.containerNo;
      if(index !== selectedContainerList.length - 1) {
        acc += ",";
      }
      return acc;
    }, "")
    return { containerList: containerList, partyId, typeOfCharge: CHARGE_TYPE.IMPORT }
  }

  getTotalCharges(importCharges: any, handlingCharges: any, insuranceCharges: any) {
    if(!importCharges) {
      return {}
    }
    const total = (importCharges.totalEntryAmt ?? 0) + (handlingCharges.totalAmt ?? 0) + (insuranceCharges.totalAmt ?? 0);
    const totalInvoice = Math.ceil(total);
    const added = totalInvoice - total;
    return { total, totalInvoice, added }
  }

  makePayload(value: any, chargeDetails: any, handlingChargeDetails: any, insuranceCharges: any, selectedContainerList: any[], partyList: any[]) {
    const isTaxInvoice = value.invoiceType;
    const entChargeDetails = this.allChargeTypes().find(chargeType => chargeType.chargeCode === CHARGE_CODE.ENTRY);
    const hanChargeDetails = this.allChargeTypes().find(chargeType => chargeType.chargeCode === CHARGE_CODE.HANDLING);
    const insChargeDetails = this.allChargeTypes().find(chargeType => chargeType.chargeCode === CHARGE_CODE.INSURANCE);
    const totalPackages = selectedContainerList.reduce((acc: number, container: any) => container.noOfPackage + acc, 0);
    const totalWeight = selectedContainerList.reduce((acc: number, container: any) => container.grWt + acc, 0);
    const rate = +(totalWeight / totalPackages).toFixed(2);
    const jsonData = [
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
        "ChargesTypeId": hanChargeDetails?.chargeId,
        "OperationId": 0,
        "Clause": "",
        "ChargeType": hanChargeDetails?.chargeCode,
        "ChargeName": hanChargeDetails?.chargeName,
        "Quantity": totalPackages,
        "Rate": rate,
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
      },
    ]
    if (Object.keys(insuranceCharges).length) {
      jsonData.push({
        "ChargesTypeId": insChargeDetails?.chargeId,
        "OperationId": 0,
        "Clause": "",
        "ChargeType": insChargeDetails?.chargeCode,
        "ChargeName": insChargeDetails?.chargeName,
        "Quantity": totalPackages,
        "Rate": rate,
        "Amount": insuranceCharges.totalInsuranceValue,
        "Discount": 0,
        "Taxable": insuranceCharges.totalInsuranceValue,
        "IGSTPer": insuranceCharges.igst,
        "IGSTAmt": insuranceCharges.igstAmount,
        "CGSTPer": insuranceCharges.cgst,
        "CGSTAmt": insuranceCharges.cgstAmount,
        "SGSTPer": insuranceCharges.sgst,
        "SGSTAmt": insuranceCharges.sgstAmount,
        "Total": insuranceCharges.totalAmt,
        "SACCode": insuranceCharges.sacCode,
      })
    }

    const payload = {
      ...value,
      moveToId: 0,
      isLoadContainerInvoice: true,
      taxInvoice: !!isTaxInvoice,
      billOfSupply: !isTaxInvoice,
      deliveryDate: this.utilService.getDateObject(value.deliveryDate),
      invoiceDate: this.utilService.getDateObject(value.invoiceDate),
      payeeName: partyList.find(party => party.partyId === value.partyId)?.partyName ?? "",
      paymentMode: "",
      otHours: "",
      container: "",
      jsonData: JSON.stringify(jsonData)
    };

    return {
      ...payload,
      applicationId: value.applicationId ?? 0,
      partyId: value.partyId ?? 0,
      payeeId: value.payeeId ?? 0,
      gstNo: value.gstNo ?? "",
      paymentMode: "",
      placeOfSupply: value.placeOfSupply ?? "",
      sezId: value.sezId ?? 0,
      otHours: value.otHours ?? "",
      container: value.container ?? "",
      createdBy: 0,
      updatedBy: 0,
      payeeName: value.payeeName ?? "",
      examinationChargeType: value.examinationChargeType ?? 0,
      remarks: value.remarks ?? "",
    };
  }
}
