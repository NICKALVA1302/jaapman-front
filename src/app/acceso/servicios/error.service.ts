import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  constructor(private toastr: ToastrService) { }

  msjError(e: HttpErrorResponse) {
    if (e.error.msg) {
      this.toastr.error(e.error.msg, 'Error');
    } else {
      this.toastr.error('Upps ocurrio un error, comuniquese con el administrador', 'Error');
    }
  }
  
  msjSuccess(e: any) {
    if (e.success) {
      this.toastr.success(e.success.msg, 'Correcto');
    } else {
      this.toastr.error('Upps ocurrió un error, comuníquese con el administrador', 'Error');
    }

  }

  msjErrorNuevo(e: any) {
    if (e.error) {
      this.toastr.error(e.error.msg, 'Error');
    } else {
      this.toastr.error('Upps ocurrió un error, comuníquese con el administrador', 'Error');
    }
  }
}
