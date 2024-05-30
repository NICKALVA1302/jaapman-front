import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appOnlyNumbers]'
})
export class OnlyNumbersDirective {
  //Directiva para que solo se pueda poner números en ciertos campos.
  @HostListener('input', ['$event']) onInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/[^0-9]/g, ''); 
    value = value.substring(0, 10); 
    input.value = value;

    // Validar la longitud mínima
    if (value.length === 10) {
      input.setCustomValidity('');
    } else {
      input.setCustomValidity('La cédula debe tener 10 números.');
    }
  }

  constructor() { }
}