import { Validator, AbstractControl } from '@angular/forms';
import { ValidationErrors } from '@angular/forms';

export class CpfCnpjValidator implements Validator {

    static cpfLength = 11;
    static cnpjLength = 14;

    static buildDigit(arr: number[]): number {

        const isCpf = arr.length < CpfCnpjValidator.cpfLength;
        const digit = arr
                .map((val, idx) => val * ((!isCpf ? idx % 8 : idx) + 2))
                .reduce((total, current) => total + current) % CpfCnpjValidator.cpfLength;

        if (digit < 2 && isCpf) {
            return 0;
        }

        return CpfCnpjValidator.cpfLength - digit;
    }

    static validate(c: AbstractControl): ValidationErrors | null {

        const cpfCnpj = c.value.replace(/\D/g, '');

        if ([CpfCnpjValidator.cpfLength, CpfCnpjValidator.cnpjLength].indexOf(cpfCnpj.length) < 0) {
            return { length: true };
        }

        if (/^([0-9])\1*$/.test(cpfCnpj)) {
            return { equalDigits: true };
        }

        const cpfCnpjArr: number[] = cpfCnpj.split('').reverse().slice(2);

        cpfCnpjArr.unshift(CpfCnpjValidator.buildDigit(cpfCnpjArr));
        cpfCnpjArr.unshift(CpfCnpjValidator.buildDigit(cpfCnpjArr));

        if (cpfCnpj !== cpfCnpjArr.reverse().join('')) {
            return { digit: true };
        }

        return null;
    }

    validate(c: AbstractControl): ValidationErrors | null {
        return CpfCnpjValidator.validate(c);
    }
}
