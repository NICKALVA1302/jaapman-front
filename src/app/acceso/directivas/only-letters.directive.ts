import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appOnlyLetters]'
})
export class OnlyLettersDirective {

  // Directiva para permitir solo letras y espacios en ciertos campos.
  @HostListener('input', ['$event']) onInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/[^a-zA-Z\s]/g, ''); // Solo letras y espacios
    input.value = value;
  }
  
    constructor() { }

}
