import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const trimmedRequiredValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const value = `${control.value ?? ''}`;
  return value.trim().length > 0 ? null : { required: true };
};

export const positiveAmountValidator = (min = 0.01): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    const rawValue = control.value;
    const value = typeof rawValue === 'string' ? Number.parseFloat(rawValue) : Number(rawValue);

    if (Number.isNaN(value)) {
      return { number: true };
    }

    return value >= min ? null : { minAmount: { min } };
  };
};
