import {Injectable} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CustomValidator} from '../../shared/custom-validation';

@Injectable({
    providedIn: 'root'
})
export class PortService {
    // Port
    public portAction = 0;

    // Common
    public disableText = false;
    public btnText = '';


    public PortDetails: any;
    public portID: number;
    public pilotID: number;
    public action = 0;
    public postalCode = '';
    public arrowAction = 1;

    public berthID: number;
    public berthRestrictionID: number;

    // Pilot Restriction
    public selectPortRes: number;
    public urlRestAction = 0;
    public headerSet = '';

    constructor(private fb: FormBuilder) {
    }

    form: FormGroup = this.fb.group({
        isoPortCode: [{value: '', disabled: this.disableText}, [Validators.required]],
        state: [{value: null, disabled: this.disableText}],
        postalCode: [{value: null, disabled: this.disableText}, [Validators.required, CustomValidator.numberValidator]],
        description: [{value: null, disabled: this.disableText}, [Validators.required]],
        status: [{value: null, disabled: ''}, [Validators.required]],
        email: [{value: null, disabled: this.disableText}, [Validators.email]]
    });
    secondFormGroup: FormGroup = this.fb.group({
        density: [{value: null, disabled: this.disableText}],
        securityLevel: [{value: null, disabled: this.disableText}],
        pfso: [{value: null, disabled: this.disableText}],
        pilotBoardingPosition: [{value: null, disabled: this.disableText}],
        distanceFromBreakWaterToPilotBoardingPosition: [{value: null, disabled: this.disableText}],
        directionOfCurrentSpeed: [{value: null, disabled: this.disableText}],
        vhfChannel: [{value: null, disabled: this.disableText}],
        tugsInPort: [{value: null, disabled: this.disableText}],
        tugsUsedForBerthingUnberthing: [{value: null, disabled: this.disableText}],
        draftRestrictionsAtAnchorage: [{value: null, disabled: this.disableText}],
        garbageDisposal: [{value: null, disabled: this.disableText}],
        shoreLeave: [{value: null, disabled: this.disableText}],
        repatriation: [{value: null, disabled: this.disableText}],
        nearestAirportDomesticInternational: [{value: null, disabled: this.disableText}],
        bunkeringFacilities: [{value: null, disabled: this.disableText}],
        gangwayShoreShipRentPossible: [{value: null, disabled: this.disableText}],
        mooringRopesOnRentPossible: [{value: null, disabled: this.disableText}],
        identificationCards: [{value: null, disabled: this.disableText}],
        anyPiracyIncidentReportedInPast: [{value: null, disabled: this.disableText}],
        availabilityOfSeamenClub: [{value: null, disabled: this.disableText}],
        averageTimeTakenForVesselBerthingFromPilotBoarding: [{value: null, disabled: this.disableText}],
        ballastWaterManagementRulesRegulation: [{value: null, disabled: this.disableText}],
        regulatingBodyPrivateGovtOwned: [{value: null, disabled: this.disableText}],
        pilotCancellationChargesApplicableCases: [{value: null, disabled: this.disableText}],
        availabilityOfRepairBerth: [{value: null, disabled: this.disableText}],
        bunkerSupplierCompanies: [{value: null, disabled: this.disableText}],
        medicalNearestBigHospitalPhoneNumber: [{value: null, disabled: this.disableText}],
        facilityForRepairsWorkshops: [{value: null, disabled: this.disableText}],
        dryDockFascilities: [{value: null, disabled: this.disableText}],
        restrictionForSignOff: [{value: null, disabled: this.disableText}], /*Added extra fields by shail as per excel sheet*/
        coastguardContactDetails: [{value: null, disabled: this.disableText}],
        harbourMaster: [{value: null, disabled: this.disableText}],
        chiefMedicalOfficer: [{value: null, disabled: this.disableText}],
        fireSafetyOfficerFireBrigadeStation: [{value: null, disabled: this.disableText}],
        commandantCisf: [{value: null, disabled: this.disableText}],
        localEmergencyResponseAndSupport: [{value: null, disabled: this.disableText}],
        portContactInformation: [{value: null, disabled: this.disableText}],
        localLawEnforcementContactDetails: [{value: null, disabled: this.disableText}]
    });

    addBirth: FormGroup = this.fb.group({
        code: ['', [Validators.required]],
        description: ['', [Validators.required]]
    });

    birthRestriction: FormGroup = this.fb.group({
        berthName: [{value: null, disabled: ''}],
        typesOfCargo: [{value: null, disabled: ''}],
        loaMaxInMeters: [{value: null, disabled: ''}],
        loaMinInMeters: [{value: null, disabled: ''}],
        beamInMeters: [{value: null, disabled: ''}],
        draftAtBerth: [{value: null, disabled: ''}],
        freeBoard: [{value: null, disabled: ''}],
        pblRestrictions: [{value: null, disabled: ''}],
        dwtMax: [{value: null, disabled: ''}],
        displacement: [{value: null, disabled: ''}],
        navigationCaution: [{value: null, disabled: ''}],
        productWiseDischargeLoadingRates: [{value: null, disabled: ''}],
        noAndCapacityOfShoreTank: [{value: null, disabled: ''}],
        shorePipelineSize: [{value: null, disabled: ''}],
        distanceFromShoreTankFarm: [{value: null, disabled: ''}],
        sizeOfShoreConnection: [{value: null, disabled: ''}],
        anyRestrictionOnTransitCargoForBerthing: [{value: null, disabled: ''}],
        reasonsForBerthingPriorityBerthingDelays: [{value: null, disabled: ''}],
        nameOfCargoSupplierReceivers: [{value: null, disabled: ''}],
        slopFacility: [{value: null, disabled: ''}],
        freshWaterAvailability: [{value: null, disabled: ''}],
        bunkeravailability: [{value: null, disabled: ''}],
        garbageDisposal: [{value: null, disabled: ''}],
        trimRequirement: [{value: null, disabled: ''}],
        densityOfWaters: [{value: null, disabled: ''}],
        restrictionsForHeightOfManifoldFromTheWaterLine: [{value: null, disabled: ''}],
        restrictionsForNightNavigation: [{value: null, disabled: ''}],
        tidalRestriction: [{value: null, disabled: ''}],
        restrictionForDistanceFromBowSternToManifold: [{value: null, disabled: ''}],
        anyOther: [{value: null, disabled: ''}],
        distanceFromBerthToFairWayBoy: [{value: null, disabled: ''}],
        channelDepth: [{value: null, disabled: ''}],
        channelWidth: [{value: null, disabled: ''}],
        channelRoundCircle: [{value: null, disabled: ''}],
    });
}
