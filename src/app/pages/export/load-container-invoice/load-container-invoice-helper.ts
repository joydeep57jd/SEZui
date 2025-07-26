import {ChangeDetectorRef, inject, signal} from "@angular/core";
import {ApiService, ToastService, UtilService} from "../../../services";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {PrintService} from "../../../services/print.service";
import {API, CHARGE_CODE} from "../../../lib";
import {LOAD_CONTAINER_INVOICE_DATA} from "./load-container-invoice-data";
import {firstValueFrom, forkJoin} from "rxjs";
import {GATE_IN_DATA} from "../../gate-operation/gate-in/gate-in-data";

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
  readonly operationTypes = GATE_IN_DATA.operationTypes

  eximTraderMap = signal<Map<number, any>>(new Map());
  partyList = signal<any[]>([]);
  containerList = signal<any[]>([]);
  containerRequestList = signal<any[]>([]);
  allChargeTypes = signal<any[]>([]);
  portList = signal<any[]>([]);
  chargeDetails = signal<any>({});
  handlingChargeDetails = signal<any>({});
  insuranceChargeDetails = signal<any>({});
  transportChargeDetails = signal<any>({});
  gateInDetails = signal<any>({});

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
    return { containerList: containerList, partyId }
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
    return { containerList: containerList, partyId, isLoadContainerInvoice: true, typeOfCharge: 2 }
  }

  getTotalCharges() {
    const total = (this.gateInDetails().operationType === this.operationTypes[0].value ?(this.chargeDetails().totalEntryAmt ?? 0) : 0) +
      (this.chargeDetails().totalExamAmt ?? 0) +
      (this.transportChargeDetails().totalAmt ?? 0);
    const totalInvoice = Math.ceil(total);
    const added = totalInvoice - total;
    return total ? { total, totalInvoice, added } : {}
  }

  async makePayload(value: any, selectedContainerList: any[], partyList: any[]) {
    const isTaxInvoice = value.invoiceType;
    const entChargeDetails = this.allChargeTypes().find(chargeType => chargeType.chargeCode === CHARGE_CODE.ENTRY);
    const exmChargeDetails = this.allChargeTypes().find(chargeType => chargeType.chargeCode === CHARGE_CODE.EXAMINATION);
    // const hanChargeDetails = this.allChargeTypes().find(chargeType => chargeType.chargeCode === CHARGE_CODE.HANDLING);
    // const insChargeDetails = this.allChargeTypes().find(chargeType => chargeType.chargeCode === CHARGE_CODE.INSURANCE);
    const trpChargeDetails = this.allChargeTypes().find(chargeType => chargeType.chargeCode === CHARGE_CODE.TRANSPORTATION);
    const totalPackages = selectedContainerList.reduce((acc: number, container: any) => container.noOfPackage + acc, 0);

    const rateApis = [];

    if ([this.operationTypes[1].value, this.operationTypes[0].value].includes(this.gateInDetails().operationType)) {
      rateApis.push(
        this.apiService.get(API.CHARGE_RATE, {
          chargeType: CHARGE_CODE.EXAMINATION,
          sacCode: this.chargeDetails().examinationSacCode,
          isImport: 'Export',
          ishigh: this.gateInDetails().materialType == "High Value"
        })
      );
    }

    if (this.gateInDetails().operationType === this.operationTypes[0].value) {
      rateApis.push(
        this.apiService.get(API.CHARGE_RATE, {
          chargeType: CHARGE_CODE.ENTRY,
          sacCode: this.chargeDetails().entrySacCode,
          isImport: 'Export',
          ishigh: this.gateInDetails().materialType == "High Value"
        })
      )
    }

    if (this.gateInDetails().operationType === this.operationTypes[2].value) {
      rateApis.push(
        this.apiService.get(API.CHARGE_RATE, {
          chargeType: CHARGE_CODE.TRANSPORTATION,
          sacCode: this.transportChargeDetails().sacCode,
          isImport: 'Export',
          ishigh: this.gateInDetails().materialType == "High Value"
        })
      )
    }

    // if(Object.keys(insuranceCharges).length) {
    //   rateApis.push(
    //     this.apiService.get(API.CHARGE_RATE, {chargeType: CHARGE_CODE.INSURANCE, sacCode: insuranceCharges.sacCode, isImport: 'Export', ishigh: true})
    //   )
    // }

    const res: any[] = await firstValueFrom(forkJoin(rateApis))

    const jsonData = [];

    if (this.gateInDetails().operationType === this.operationTypes[0].value) {
      jsonData.push({
        "ChargesTypeId": entChargeDetails?.chargeId,
        "OperationId": 0,
        "Clause": "",
        "ChargeType": entChargeDetails?.chargeCode,
        "ChargeName": entChargeDetails?.chargeName,
        "Quantity": totalPackages,
        "Rate": res[1].data.rate,
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
      })
    }
    if([this.operationTypes[1].value, this.operationTypes[0].value].includes(this.gateInDetails().operationType)) {
      jsonData.push(
        {
          "ChargesTypeId": exmChargeDetails.chargeId,
          "OperationId": 0,
          "Clause": "",
          "ChargeType": exmChargeDetails.chargeCode,
          "ChargeName": exmChargeDetails.chargeName,
          "Quantity": totalPackages,
          "Rate": res[0].data.rate,
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
      )
    }

    if (this.gateInDetails().operationType === this.operationTypes[2].value) {
      jsonData.push({
        "ChargesTypeId": trpChargeDetails.chargeId,
        "OperationId": 0,
        "Clause": "",
        "ChargeType": trpChargeDetails.chargeCode,
        "ChargeName": this.transportChargeDetails().chargeName,
        "Quantity": totalPackages,
        "Rate": res[0].data.rate,
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
    //   {
    //     "ChargesTypeId": hanChargeDetails?.chargeId,
    //     "OperationId": 0,
    //     "Clause": "",
    //     "ChargeType": hanChargeDetails?.chargeCode,
    //     "ChargeName": hanChargeDetails?.chargeName,
    //     "Quantity": totalPackages,
    //     "Rate": res[1].data.rate,
    //     "Amount": handlingChargeDetails.totalValue,
    //     "Discount": 0,
    //     "Taxable": handlingChargeDetails.totalValue,
    //     "IGSTPer": handlingChargeDetails.igst,
    //     "IGSTAmt": handlingChargeDetails.igstAmount,
    //     "CGSTPer": handlingChargeDetails.cgst,
    //     "CGSTAmt": handlingChargeDetails.cgstAmount,
    //     "SGSTPer": handlingChargeDetails.sgst,
    //     "SGSTAmt": handlingChargeDetails.sgstAmount,
    //     "Total": handlingChargeDetails.totalAmt,
    //     "SACCode": handlingChargeDetails.sacCode,
    //   },
    // ]
    // if (Object.keys(insuranceCharges).length) {
    //   jsonData.push({
    //     "ChargesTypeId": insChargeDetails?.chargeId,
    //     "OperationId": 0,
    //     "Clause": "",
    //     "ChargeType": insChargeDetails?.chargeCode,
    //     "ChargeName": insChargeDetails?.chargeName,
    //     "Quantity": totalPackages,
    //     "Rate": res[2].data.rate,
    //     "Amount": insuranceCharges.totalInsuranceValue,
    //     "Discount": 0,
    //     "Taxable": insuranceCharges.totalInsuranceValue,
    //     "IGSTPer": insuranceCharges.igst,
    //     "IGSTAmt": insuranceCharges.igstAmount,
    //     "CGSTPer": insuranceCharges.cgst,
    //     "CGSTAmt": insuranceCharges.cgstAmount,
    //     "SGSTPer": insuranceCharges.sgst,
    //     "SGSTAmt": insuranceCharges.sgstAmount,
    //     "Total": insuranceCharges.totalAmt,
    //     "SACCode": insuranceCharges.sacCode,
    //   })
    // }

    const payload = {
      ...value,
      moveToId: 0,
      isLoadContainerInvoice: true,
      taxInvoice: !!isTaxInvoice,
      billOfSupply: !isTaxInvoice,
      deliveryDate: this.utilService.getDateObject(value.deliveryDate),
      invoiceDate: this.utilService.getDateObject(value.invoiceDate),
      payeeName: partyList.find(party => party.partyId == value.partyId)?.partyName ?? "",
      paymentMode: "",
      otHours: "",
      container: "",
      jsonData: JSON.stringify(jsonData)
    };

    return {
      ...payload,
      applicationId: payload.applicationId ?? 0,
      partyId: payload.partyId ?? 0,
      payeeId: payload.payeeId ?? 0,
      gstNo: payload.gstNo ?? "",
      paymentMode: "",
      placeOfSupply: payload.placeOfSupply ?? "",
      sezId: payload.sezId ?? 0,
      otHours: payload.otHours ?? "",
      container: payload.container ?? "",
      createdBy: 0,
      updatedBy: 0,
      payeeName: payload.payeeName ?? "",
      examinationChargeType: payload.examinationChargeType ?? 0,
      remarks: payload.remarks ?? "",
    };
  }
}
