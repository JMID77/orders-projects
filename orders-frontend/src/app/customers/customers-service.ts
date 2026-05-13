import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core'
import { environment } from '../../environments/environment';
import { map, Observable } from 'rxjs';
import { Customer, CustomerMapper } from './model/customer.model';

@Injectable({
  providedIn: 'root',
})
export class CustomersService {
  httpClient: HttpClient = inject(HttpClient);
  baseUrl: string = environment.apiUrl + 'customers';
  
  getCustomers(): Observable<Customer[]> {
    return this.httpClient.get<Customer[]>(this.baseUrl)
    .pipe(
      map(CustomerMapper.fromDtos)
    );
  }

  getCustomer(customerId: number): Observable<Customer> {
    return this.httpClient.get<Customer>(`${this.baseUrl}/${customerId}`)
    .pipe(
      map(CustomerMapper.fromDto)
    );
  }

  deleteCustomer(customerId: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.baseUrl}/${customerId}`);
  }

  createCustomer(customer: Customer): Observable<Customer> {
    return this.httpClient.post<Customer>(this.baseUrl, CustomerMapper.toDto(customer))
    .pipe(
      map(CustomerMapper.fromDto)
    );
  }
  
  updateCustomer(customerId: number, customer: Customer): Observable<Customer> {
    return this.httpClient.put<Customer>(`${this.baseUrl}/${customerId}`, CustomerMapper.toDto(customer))
    .pipe(
      map(CustomerMapper.fromDto)
    );
  }
}
