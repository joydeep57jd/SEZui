import {API, CHARGE_CODE, CHARGE_TYPE} from "../../../lib";
import {inject, signal} from "@angular/core";
import {ApiService, UtilService} from "../../../services";
import {BehaviorSubject} from "rxjs";

export class YardInvoiceHelper {
  apiService = inject(ApiService);
  utilService = inject(UtilService)

  readonly apiUrls = API.IMPORT.YARD_INVOICE;

  eximTraderMap = signal<Map<number, any>>(new Map());
  partyList = signal<any[]>([]);
  containerList = signal<any[]>([]);
  allChargeTypes = signal<any[]>([]);
  applicationList = signal<any[]>([])
  chargeDetails = signal<any>({});
  transportChargeDetails = signal<any>({});
  insuranceChargeDetails = signal<any>({});
  totalCharges = signal<any>({});
  isChargesFetching = signal<boolean>(false);
  fetchChargesParams$ = new BehaviorSubject<any>(null);

  getCustomAppraisementList () {
    this.apiService.get(this.apiUrls.APPLICATION_LIST, {isInvoiceCheck: true}).subscribe({
      next: (response: any) => {
        this.applicationList.set(response.data)
      }
    })
  }

  getContainerList(appNo: number) {
    this.apiService.get(this.apiUrls.OBL_CONTAINER_LIST, {AppNo: appNo}).subscribe({
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

  updateFetchChargesParams(formValue: any, selectedContainerList: any[]) {
    const partyId = formValue.partyId;
    if(!partyId || !selectedContainerList.length) {
      this.chargeDetails.set({});
      this.transportChargeDetails.set({});
      this.insuranceChargeDetails.set({});
      this.totalCharges.set(this.getTotalCharges());
      this.fetchChargesParams$.next(null)
      return
    }

    const containerOblList = selectedContainerList.reduce((acc: any, container: any, index: number) => {
      const containerObl = this.getContainerOblNo(container);
      acc.all += containerObl;
      if(index !== selectedContainerList.length - 1) {
        acc.all += ",";
      }
      if(!container.isInsured) {
        if(acc.insured.length > 0) {
          acc.insured += ",";
        }
        acc.insured += containerObl;
      }
      return acc;
    }, {all: "", insured: ""})

    const baseParams = { containerOBLList: containerOblList.all, partyId }
    const params = {
      entryParams: {...baseParams, typeOfCharge: CHARGE_TYPE.IMPORT},
      transportParams: formValue.transportationChargeType && {...baseParams},
      insuredParams: (containerOblList.insured && formValue.invoiceDate) && {containerOblList: containerOblList.insured, partyId, invoiceDate: this.utilService.getDateObject(formValue.invoiceDate)}
    }
    if(!params.transportParams) {
      this.transportChargeDetails.set({});
    }
    if(!params.insuredParams) {
      this.insuranceChargeDetails.set({});
    }
    this.fetchChargesParams$.next(params)
  }

  getTotalCharges() {
    if(!Object.keys(this.chargeDetails())) {
      return {}
    }
    const total = (this.chargeDetails().totalEntryAmt ?? 0) + (this.chargeDetails().totalExamAmt ?? 0) + (this.transportChargeDetails().totalAmt ?? 0) + (this.insuranceChargeDetails().totalAmt ?? 0);
    const totalInvoice = Math.ceil(total);
    const added = totalInvoice - total;
    return { total, totalInvoice, added }
  }

  getContainerOblNo(container: any) {
    return `${container.containerCBTNo}#${container.obL_HBL_No}`;
  }

  makePayload(value: any, selectedContainerList: any[], partyList: any[]) {
    const isTaxInvoice = value.invoiceType;
    const isFactoryDestuffing = value.destuffingType;
    const entChargeDetails = this.allChargeTypes().find(chargeType => chargeType.chargeCode === CHARGE_CODE.ENTRY);
    const exmChargeDetails = this.allChargeTypes().find(chargeType => chargeType.chargeCode === CHARGE_CODE.EXAMINATION);
    const trpChargeDetails = this.allChargeTypes().find(chargeType => chargeType.chargeCode === CHARGE_CODE.TRANSPORTATION);
    const insChargeDetails = this.allChargeTypes().find(chargeType => chargeType.chargeCode === CHARGE_CODE.INSURANCE);
    const totalPackages = selectedContainerList.reduce((acc: number, container: any) => container.noOfPackage + acc, 0);
    const totalWeight = selectedContainerList.reduce((acc: number, container: any) => container.grWt + acc, 0);
    const rate = +(totalWeight / totalPackages).toFixed(2);

    const jsonData = [
      {
        "ChargesTypeId": entChargeDetails.chargeId,
        "OperationId": 0,
        "Clause": "",
        "ChargeType": entChargeDetails.chargeCode,
        "ChargeName": entChargeDetails.chargeName,
        "Quantity": totalPackages,
        "Rate": rate,
        "Amount": this.chargeDetails().totalEntryValue,
        "Discount": 0,
        "Taxable": this.chargeDetails().totalEntryValue,
        "IGSTPer": this.chargeDetails().igsTper,
        "IGSTAmt": this.chargeDetails().entryIGSTAmount,
        "CGSTPer": this.chargeDetails().cgsTper,
        "CGSTAmt": this.chargeDetails().entryCGSTAmount,
        "SGSTPer": this.chargeDetails().sgsTper,
        "SGSTAmt": this.chargeDetails().entrySGSTAmount,
        "Total": this.chargeDetails().totalEntryAmt,
        "SACCode": this.chargeDetails().entrySacCode,
      },
      {
        "ChargesTypeId": exmChargeDetails.chargeId,
        "OperationId": 0,
        "Clause": "",
        "ChargeType": exmChargeDetails.chargeCode,
        "ChargeName": exmChargeDetails.chargeName,
        "Quantity": totalPackages,
        "Rate": rate,
        "Amount": this.chargeDetails().totalExamValue,
        "Discount": 0,
        "Taxable": this.chargeDetails().totalExamValue,
        "IGSTPer": this.chargeDetails().igsTperExam,
        "IGSTAmt": this.chargeDetails().examIGSTAmount,
        "CGSTPer": this.chargeDetails().cgsTperExam,
        "CGSTAmt": this.chargeDetails().examCGSTAmount,
        "SGSTPer": this.chargeDetails().sgsTperExam,
        "SGSTAmt": this.chargeDetails().examSGSTAmount,
        "Total": this.chargeDetails().totalExamAmt,
        "SACCode": this.chargeDetails().examinationSacCode,
      }
    ]

    if(Object.keys(this.insuranceChargeDetails()).length) {
      jsonData.push({
        "ChargesTypeId": insChargeDetails?.chargeId,
        "OperationId": 0,
        "Clause": "",
        "ChargeType": insChargeDetails?.chargeCode,
        "ChargeName": insChargeDetails?.chargeName,
        "Quantity": totalPackages,
        "Rate": rate,
        "Amount": this.insuranceChargeDetails().totalInsuranceValue,
        "Taxable": this.insuranceChargeDetails().totalInsuranceValue,
        "IGSTPer": this.insuranceChargeDetails().igst,
        "IGSTAmt": this.insuranceChargeDetails().igstAmount,
        "CGSTPer": this.insuranceChargeDetails().cgst,
        "CGSTAmt": this.insuranceChargeDetails().cgstAmount,
        "SGSTPer": this.insuranceChargeDetails().sgst,
        "SGSTAmt": this.insuranceChargeDetails().sgstAmount,
        "Total": this.insuranceChargeDetails().totalAmt,
        "Discount": 0,
        "SACCode": this.insuranceChargeDetails().sacCode,
      })
    }

    if (Object.keys(this.transportChargeDetails()).length) {
      jsonData.push({
        "ChargesTypeId": trpChargeDetails.chargeId,
        "OperationId": 0,
        "Clause": "",
        "ChargeType": trpChargeDetails.chargeCode,
        "ChargeName": this.transportChargeDetails().chargeName,
        "Quantity": totalPackages,
        "Rate": rate,
        "Amount": this.transportChargeDetails().totalValue,
        "Discount": 0,
        "Taxable": this.transportChargeDetails().totalValue,
        "IGSTPer": this.transportChargeDetails().igst,
        "IGSTAmt": this.transportChargeDetails().igstAmount,
        "CGSTPer": this.transportChargeDetails().cgst,
        "CGSTAmt": this.transportChargeDetails().cgstAmount,
        "SGSTPer": this.transportChargeDetails().sgst,
        "SGSTAmt": this.transportChargeDetails().sgstAmount,
        "Total": this.transportChargeDetails().totalAmt,
        "SACCode": this.transportChargeDetails().sacCode,
      })
    }

    const payload = {
      ...value,
      isLoadContainerInvoice: false,
      moveToId: 0,
      taxInvoice: !!isTaxInvoice,
      billOfSupply: !isTaxInvoice,
      factoryDestuffing: !!isFactoryDestuffing,
      directDestuffing: !isFactoryDestuffing,
      deliveryDate: this.utilService.getDateObject(value.deliveryDate),
      invoiceDate: this.utilService.getDateObject(value.invoiceDate),
      payeeName: partyList.find(party => party.partyId === value.partyId)?.partyName ?? "",
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
