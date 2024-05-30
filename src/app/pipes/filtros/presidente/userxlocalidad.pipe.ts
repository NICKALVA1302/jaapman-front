import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'userxlocalidad'
})
export class UserxlocalidadPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
