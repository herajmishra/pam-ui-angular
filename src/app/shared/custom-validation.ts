import {AbstractControl} from '@angular/forms';

export class CustomValidator  {
    static numberValidator(number): any {
        if (number.pristine) {
            return null;
        }
        const NUMBER_REGEXP = /^-?[\d]+(?:e-?\d+)?$/;
        number.markAsTouched();
        if (NUMBER_REGEXP.test(number.value)) {
            return null;
        }
        return {
            invalidNumber: true
        };
    }

    static decimalValidator(number): any {
        if (number.pristine) {
            return null;
        }
        const NUMBER_REGEXP = /^-?[\d.]+(?:e-?\d+)?$/;
        number.markAsTouched();
        if (NUMBER_REGEXP.test(number.value)) {
            return null;
        }
        return {
            invalidNumber: true
        };
    }

    static removeSpaces(control: AbstractControl) {
        if (control && control.value && !control.value.replace(/\s/g, '').length) {
            control.setValue('');
        }
        return null;
    }

    static panValidator(pan): any {
        if (pan.pristine) {
            return null;
        }
        const NUMBER_REGEXP = /^([a-zA-Z]){5}([0-9]){4}([A-Z]){1}?$/;
        pan.markAsTouched();
        if (NUMBER_REGEXP.test(pan.value)) {
            return null;
        }
        return {
            invalidPanNumber: true
        };
    }

    static tanValidator(tan): any {
        if (tan.pristine) {
            return null;
        }
        const NUMBER_REGEXP = /^([a-zA-Z]){4}([0-9]){5}([A-Z]){1}?$/;
        tan.markAsTouched();
        if (NUMBER_REGEXP.test(tan.value)) {
            return null;
        }
        return {
            invalidTanNumber: true
        };
    }

    static gstValidator(gst): any {
        if (gst.pristine) {
            return null;
        }
        const NUMBER_REGEXP = /^\d{2}[A-Z]{5}\d{4}[A-Z]\d[Z][A-Z\d]?$/;
        // const NUMBER_REGEXP = /^\d{2}[A-Z]{5}\d{4}[A-Z]\d[Z][A-Z\d]$;
        // const NUMBER_REGEXP = /^([0-9]){4}([A-Z]){3}([0-9]){5}([A-Z]){3}?$/;
        gst.markAsTouched();
        if (NUMBER_REGEXP.test(gst.value)) {
            return null;
        }
        return {
            invalidGSTNumber: true
        };
    }
    static ifscCodeValidator(ifsc): any {
        if (ifsc.pristine) {
            return null;
        }
        const NUMBER_REGEXP = /^([A-Z]){4}([0-9]){7}?$/;
        ifsc.markAsTouched();
        if (NUMBER_REGEXP.test(ifsc.value)) {
            return null;
        }
        return {
            invalidIFSCNumber: true
        };
    }

    static swiftCodeValidator(code): any {
        if (code.pristine) {
            return null;
        }
        const NUMBER_REGEXP = /^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/;
        code.markAsTouched();
        if (NUMBER_REGEXP.test(code.value)) {
            return null;
        }
        return {
            invalidSwiftCode: true
        };
    }

    static meterUnitValidation(val): any {
        if (val.pristine) {
            return null;
        }
        const NUMBER_REGEXP = /^\d{0,3}(\.\d{1,2})?$/;
        val.markAsTouched();
        if (NUMBER_REGEXP.test(val.value)) {
            return null;
        }
        return {
            invalidMeterUnitNumber: true
        };
    }

    static meterLatitude(val): any {
        if (val.pristine) {
            return null;
        }
        const NUMBER_REGEXP = /^\-*\d{0,3}(\.\d{1,6})?$/;
        val.markAsTouched();
        if (NUMBER_REGEXP.test(val.value)) {
            return null;
        }
        return {
            invalidMeterLatitudeNumber: true
        };
    }

    static ROEValidation(val): any {
        if (val.pristine) {
            return null;
        }
        const NUMBER_REGEXP = /^\d+(\.\d{1,6})?$/;
        val.markAsTouched();
        if (NUMBER_REGEXP.test(val.value)) {
            return null;
        }
        return {
            invalidROENumber: true
        };
    }

    static alphaValidator(number): any {
        if (number.pristine) {
            return null;
        }
        const NUMBER_REGEXP = /^[a-zA-Z ]*$/;
        number.markAsTouched();
        if (NUMBER_REGEXP.test(number.value)) {
            return null;
        }
        return {
            invalidAlpha: true
        };
    }

    static teleValidator(number): any {
        if (number.pristine) {
            return null;
        }
        const NUMBER_REGEXP = /^[0-9-+()]*$/;
        number.markAsTouched();
        if (NUMBER_REGEXP.test(number.value)) {
            return null;
        }
        return {
            invalidNumber: true
        };
    }

    static roePDAValidators(number): any {
        if (number.pristine) {
            return null;
        }
        const NUMBER_REGEXP = /^\d{1,2}(\.\d{1,4})?$/;
        number.markAsTouched();
        if (NUMBER_REGEXP.test(number.value)) {
            return null;
        }
        return {
            roeNumber: true
        };
    }

    static beamLOALBPPDAValidators(number): any {
        if (number.pristine) {
            return null;
        }
        const NUMBER_REGEXP = /^\d{1,5}(\.\d{1,2})?$/;
        number.markAsTouched();
        if (NUMBER_REGEXP.test(number.value)) {
            return null;
        }
        return {
            beamNumber: true
        };
    }
}
