import {Injectable} from '@angular/core';
import {AuthService} from '../helper/auth.service';
import {HttpService} from './http.service';

@Injectable({
    providedIn: 'root'
})
export class ApiUrlService {
    // Login Url
    login = 'login';
    logout = 'logout';
    continueLogin = 'continue';
    selectorg = 'select-org';

    // Master -> Company
    getCompanyByID = 'company/';
    getCompanyDetails = 'company';
    updateCompanyDetails = 'company';
    getCountryComList = 'country';

    // Master -> Organization
    getOrgList = 'organization/findByCompanyId?id=';
    saveOrganization = 'organization';
    getFindByOrgID = 'organization/';
    getFindAllOrgList = 'organization';
    deleteOrganization = 'organization/';

    // Master -> Branch
    getBranchList = 'branch/findByOrgId/';
    saveBranch = 'branch';
    getFindByBrnchID = 'branch/';
    deleteBranch = 'branch/';

    // Master -> Port
    getPortList = 'port';
    savePort = 'port';
    getFindByPortID = 'port/';
    deletePort = 'port/';

    // Master -> Port -> Pilot Restriction
    savePilot = 'port/pilotDetails/save';
    getFindByPilotID = 'port/pilotDetails/findByPortId/';

    // Master -> Vessel
    getVesselList = 'vessel';
    saveVessel = 'vessel';
    getFindByVesselID = 'vessel/';
    deleteVesselID = 'vessel/';
    getVesselLookupList = 'lookUp/findByKeys?keys=TRADE~VESSEL_TYPE~VESSEL_ANNOTATION ';
    printVessel= this.http.master+'vessel/print';


    // Master -> Customer-contact
    getCustomercntList = 'customer-cnt/findAll';
    saveCustomercnt = 'customer-cnt/save';
    getFindByCustomercntID = 'customer-cnt/findById/';
    deleteCustomercntID = 'customer-cnt/delete/';


    // Master -> Customer-bank
    saveCustomerbank = 'bank';
    getFindByCustomerbankID = 'bank/customer/findById/';
    getFindByCustBankID = 'bank/';
    deleteCustbankID = 'bank/';
    getBankLookupList = 'lookUp/findByKeys?keys=MODE_OF_PAYMENT~TYPE_OF_ACCOUNT';

    // Master -> Port -> Birth
    getBirthList = 'berth/findByPortId/';
    saveBerth = 'berth';
    getFindByBirthID = 'berth/';
    deleteBirthID = 'berth/';

    // Master -> Berth -> Restriction
    saveBerthRestriction = 'berth/restriction/save';
    getBerthRestriction = 'berth/restriction/findByBerthId/';
    
    // Master -> service
    getserviceList = 'service';
    saveServiceCnt = 'service';
    getFindByserviceID = 'service/';
    deleteserviceID = 'service/';
    getServiceLookupList = 'lookUp/findByKeys?keys=CHARGE_CATEGORY';

    // Master -> tax-details
    getTaxdetList = 'service/tax-details/';
    getTaxdetListid = 'service/tax-details/by-service/';
    saveTaxdet = 'service/tax-details';
    deleteTaxdet = 'service/tax-details/';


    // Master -> Lookup
    getLookupDetails = 'lookUp/';
    getGroupKeyName = 'lookUp/filter?key=';
    saveLookup = 'lookUp';
    getLookupByID = 'lookUp/';
    deleteLookup = 'lookUp/';

    // Master -> Vendor
    getVendorList = 'vendor';
    saveVendor = 'vendor';
    getFindByVendorID = 'vendor/';
    deleteVendorID = 'vendor/';

// Master -> Customer
    getCustomerList = 'customer';
    saveCustomer = 'customer';
    getFindByCustomerID = 'customer/';
    deleteCustomerID = 'customer/';
    getCustLookupList = 'lookUp/findByKeys?keys=CUSTOMER_TYPE';

    // Master -> Vendor-bank
    saveVendorbank = 'bank';
    getFindByVendorbankID = 'bank/vendor/findById/';
    getFindByBankID = 'bank/';
    deleteVendorbankID = 'bank/';
    getVendBankLookupList = 'lookUp/findByKeys?keys=MODE_OF_PAYMENT~TYPE_OF_ACCOUNT';


    // Master -> Country
    getCountryList = 'country';
    saveCountry = 'country';
    getFindByCountryID = 'country/';
    deleteCountryID = 'country/';

    // Master -> Vendor -> Service
    getVendorServiceList = 'vendor/findServiceByVendorId/';
    saveVendorService = 'vendor/service/save';

    // Master -> Customer -> Service
    getCustomerServiceList = 'customer/findServiceByCustomerId/';
    savecustomerService = 'customer/service/save';


    // PDA
    getPDAList = 'pda/';
    getPDApayload = 'pda/onLoad/';
    getFindByKeyPort = 'port/getPortData/';
    getFindByKeyBranch = 'branch/getBranchData/';
    getFindByKeyCustomer = 'customer/getCustomerData/';
    getFindByKeyVessel = 'vessel/getVesselData/';
    getFindByKeyServiceCode = 'service/getServiceData/';
    createPDA = 'pda/';
    getPDAFindByID = 'pda/';
    getServiceBasedOnPortId = 'service/by-port/';
    generatePDF = this.http.master + 'pda/generate/';
    savePDAService = 'pda/pdaService?status=null';           // Change==========================
    getPDABasedFetchServiceDetails = 'pda/pdaService/pdaId/';
    deletePDA = 'pda/';
    pdaStatus = 'pda/updatePdaStatus/';

    // PDA -> Tarrif
    getPageLoadDataMaster = 'tariff/details/page-load?portId=';
    saveTarrifMasterProfile = 'tariff';
    getTarrifheaderById = 'tariff/details/by-header/';
    getLookupListData = 'lookUp/findByKeys?keys=';
    saveTarrifDetails = 'tariff/details/save';
    getFetchTariffDetailsBasedPDA = 'tariff/fetch-tariff?';
    getTarrifMaster = 'tariff/by-port/';
    deleteAllPDAService = 'pda/pdaService/'; // Change ==============================
    getFindByKeySuggestionServiceCode = 'service/getServicesByPort/';
    sendMail = 'pda/send/';

    // PDA -> Service PDA
    getPDAVendorDetails = 'pda/acceptedJobNo';
    getPDAIDBasedDetails = 'pda/pdaService/pdaId/';
    saveServicePDA = 'pda/pdaService?status=';

    // Finance -> Inflow
    getInflowCustomerList = 'finance/bankPayment/customer';
    getInflowSuspenseCustomerList = 'finance/bankPayment/suspense';
    saveInflowCustomerList = 'finance/bankPayment';
    updateStatusInflowCustomer = 'finance/bankPayment/approval';
    getInflowBankNameKey = 'bank/getBank/';

    // Finance -> Fund Allocation
    getFinanceCustomerList = 'finance/bankPayment/getCustomerPaymentList';
    getCustomerJobDetails = 'finance/fundAllocation/jobsByCustomer/';
    getBankReferenceList = 'finance/bankPayment/getBankReferenceNo?customerId=';
    saveFundAllocation = 'finance/fundAllocation';
    getAllocationDetails = 'finance/fundAllocation/';
    getAllocationChangeStatus = 'finance/fundAllocation/approval';

    // Finance -> Branch Requisition
    getFinanceBranchJobList = 'finance/branch-requisition/accepted-job-list/';
    getFinanceServiceList = 'pda/pdaService/findAllServicesForBranchRequisition/';
    getParticularList = '';
    saveParticularList = 'finance/branch-requisition';

    constructor(public authService: AuthService,
                private http: HttpService) {
    }
}
