import { HttpClient } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { environment } from 'environments/environment'
import { VatCode, VatCodeDto, VatCodeMapper } from './model/vatcode-model'
import { map, Observable } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class VatCodeService {
  httpClient: HttpClient = inject(HttpClient)
  baseUrl: string = environment.apiUrl + 'vat'


  getVatCodes(): Observable<VatCode[]> {
    return this.httpClient.get<VatCodeDto[]>(this.baseUrl)
      .pipe(
        map(VatCodeMapper.fromDtos)
      );
  }

  getVatCode(vatId: number): Observable<VatCode> {
    return this.httpClient.get<VatCodeDto>(`${this.baseUrl}/${vatId}`)
      .pipe(
        map(VatCodeMapper.fromDto)
      );
  }

  deleteVatCode(vatId: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.baseUrl}/${vatId}`);
  }

  createVatCode(vat: VatCode): Observable<VatCode> {
    return this.httpClient.post<VatCodeDto>(this.baseUrl, VatCodeMapper.toDto(vat))
    .pipe(
      map(VatCodeMapper.fromDto)
    );
  }

  updateVatCode(vatId: number, vat: VatCode): Observable<VatCode> {
    return this.httpClient.put<VatCodeDto>(`${this.baseUrl}/${vatId}`, VatCodeMapper.toDto(vat))
    .pipe(
      map(VatCodeMapper.fromDto)
    );
  }
}
