import {API, CHARGE_CODE, CHARGE_TYPE} from "../../../lib";
import {inject, signal} from "@angular/core";
import {ApiService, UtilService} from "../../../services";

export class YardInvoiceHelper {
  apiService = inject(ApiService);
  utilService = inject(UtilService)

  readonly apiUrls = API.IMPORT.YARD_INVOICE;

  eximTraderMap = signal<Map<number, any>>(new Map());
  partyList = signal<any[]>([]);
  containerList = signal<any[]>([]);
  allChargeTypes = signal<any[]>([]);

  getContainerList() {
    this.apiService.get(this.apiUrls.OBL_CONTAINER_LIST).subscribe({
      next: (response: any) => {
        this.containerList.set(response.data)
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

  getTotalCharges(chargeDetails: any, transportChargeDetails: any) {
    if(!chargeDetails) {
      return {}
    }
    const total = (chargeDetails.totalEntryAmt ?? 0) + (chargeDetails.totalExamAmt ?? 0) + (transportChargeDetails.totalAmt_LV ?? 0) + (transportChargeDetails.totalAmt_HV ?? 0);
    const totalInvoice = Math.ceil(total);
    const added = totalInvoice - total;
    return { total, totalInvoice, added }
  }

  getContainerOblNo(container: any) {
    return `${container.containerCBTNo}#${container.obL_HBL_No}`;
  }

  makePayload(value: any, chargeDetails: any, transportChargeDetails: any, selectedContainerList: any[], partyList: any[]) {
    const isTaxInvoice = value.invoiceType;
    const isFactoryDestuffing = value.destuffingType;
    const entChargeDetails = this.allChargeTypes().find(chargeType => chargeType.chargeCode === CHARGE_CODE.ENTRY);
    const exmChargeDetails = this.allChargeTypes().find(chargeType => chargeType.chargeCode === CHARGE_CODE.EXAMINATION);
    const trpChargeDetails = this.allChargeTypes().find(chargeType => chargeType.chargeCode === CHARGE_CODE.TRANSPORTATION);
    const totalPackages = selectedContainerList.reduce((acc: number, container: any) => container.noOfPackage + acc, 0);
    const totalWeight = selectedContainerList.reduce((acc: number, container: any) => container.grWt + acc, 0);
    const rate = +(totalWeight / totalPackages).toFixed(2);
    return {
      ...value,
      taxInvoice: isTaxInvoice,
      billOfSupply: !isTaxInvoice,
      factoryDestuffing: isFactoryDestuffing,
      directDestuffing: !isFactoryDestuffing,
      deliveryDate: this.utilService.getDateObject(value.deliveryDate),
      invoiceDate: this.utilService.getDateObject(value.invoiceDate),
      payeeName: partyList.find(party => party.partyId === value.partyId)?.partyName,
      jsonData: JSON.stringify([
        {
          "ChargesTypeId": entChargeDetails.chargeId,
          "OperationId": 0,
          "Clause": "",
          "ChargeType": entChargeDetails.chargeCode,
          "ChargeName": entChargeDetails.chargeName,
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
          "ChargesTypeId": exmChargeDetails.chargeId,
          "OperationId": 0,
          "Clause": "",
          "ChargeType": exmChargeDetails.chargeCode,
          "ChargeName": exmChargeDetails.chargeName,
          "Quantity": totalPackages,
          "Rate": rate,
          "Amount": chargeDetails.totalExamValue,
          "Discount": 0,
          "Taxable": chargeDetails.totalExamValue,
          "IGSTPer": chargeDetails.igsTperExam,
          "IGSTAmt": chargeDetails.examIGSTAmount,
          "CGSTPer": chargeDetails.cgsTperExam,
          "CGSTAmt": chargeDetails.examCGSTAmount,
          "SGSTPer": chargeDetails.sgsTperExam,
          "SGSTAmt": chargeDetails.examSGSTAmount,
          "Total": chargeDetails.totalExamAmt,
          "SACCode": chargeDetails.examinationSacCode,
        },
        {
          "ChargesTypeId": trpChargeDetails.chargeId,
          "OperationId": 0,
          "Clause": "",
          "ChargeType": trpChargeDetails.chargeCode,
          "ChargeName": trpChargeDetails.chargeName,
          "Quantity": totalPackages,
          "Rate": rate,
          "Amount": transportChargeDetails.totalHighValue,
          "Discount": 0,
          "Taxable": transportChargeDetails.totalHighValue,
          "IGSTPer": transportChargeDetails.igsT_HV,
          "IGSTAmt": transportChargeDetails.highValueIGSTAmount,
          "CGSTPer": transportChargeDetails.cgsT_HV,
          "CGSTAmt": transportChargeDetails.highValueCGSTAmount,
          "SGSTPer": transportChargeDetails.sgsT_HV,
          "SGSTAmt": transportChargeDetails.highValueSGSTAmount,
          "Total": transportChargeDetails.totalAmt_HV,
          "SACCode": transportChargeDetails.sacCode_HV,
        },
        {
          "ChargesTypeId": trpChargeDetails.chargeId,
          "OperationId": 0,
          "Clause": "",
          "ChargeType": trpChargeDetails.chargeCode,
          "ChargeName": trpChargeDetails.chargeName,
          "Quantity": totalPackages,
          "Rate": rate,
          "Amount": transportChargeDetails.totLowValue,
          "Discount": 0,
          "Taxable": transportChargeDetails.totLowValue,
          "IGSTPer": transportChargeDetails.igsT_LV,
          "IGSTAmt": transportChargeDetails.highValueIGSTAmount,
          "CGSTPer": transportChargeDetails.cgsT_LV,
          "CGSTAmt": transportChargeDetails.highValueCGSTAmount,
          "SGSTPer": transportChargeDetails.sgsT_LV,
          "SGSTAmt": transportChargeDetails.lowValueSGSTAmount,
          "Total": transportChargeDetails.totalAmt_LV,
          "SACCode": transportChargeDetails.sacCode_LV,
        }
      ])
    };
  }
}
