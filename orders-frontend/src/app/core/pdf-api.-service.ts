import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { Observable, throwError } from "rxjs";


export enum EnumTypePdf {
  ORDER = 'order',
}

@Injectable({
    providedIn: 'root',
})
export class PdfApiService {
  httpClient: HttpClient = inject(HttpClient)
  baseUrl: string = environment.apiUrl + 'pdf'

  
  generatorPdf(id: number, type: EnumTypePdf): Observable<Blob> {
    switch(type) {
      case EnumTypePdf.ORDER: {
        return this.generatorPdfOrder(id);
      }
      default: {
        return throwError(() => new Error('Type de PDF non supporté'));
      }
    }
  }

  private generatorPdfOrder(orderId: number): Observable<Blob> {
    return this.httpClient.get(`${this.baseUrl}/order/${orderId}`, {
        responseType: 'blob',
    });
  }
}