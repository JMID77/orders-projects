import { HttpClient } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { map, Observable } from 'rxjs'
import { OrderHeader, OrderHeaderDto, OrderMapper } from './model/order-model'
import { environment } from '../../environments/environment'
import { OrderHeaderForm } from './model/order-model-form'
import { StatusOption } from './model/order.status.enum'

@Injectable({
  providedIn: 'root',
})
export class OrdersServices {
  httpClient: HttpClient = inject(HttpClient)
  baseUrl: string = environment.apiUrl + 'orders'

  getOrders(): Observable<OrderHeader[]> {
    return this.httpClient.get<OrderHeaderDto[]>(this.baseUrl)
    .pipe(
      map(OrderMapper.fromDtos)
    );
  }

  getOrder(orderId: number): Observable<OrderHeader> {
    return this.httpClient.get<OrderHeaderDto>(`${this.baseUrl}/${orderId}`)
    .pipe(
      map(OrderMapper.fromDto)
    );
  }

  deleteOrder(orderId: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.baseUrl}/${orderId}`);
  }

  createOrder(order: OrderHeaderForm): Observable<OrderHeader> {
    const {file_pdf, ...dtoOrder} = order;
    
    return this.httpClient.post<OrderHeaderDto>(this.baseUrl, dtoOrder)
    .pipe(
      map(OrderMapper.fromDto)
    );
  }

  updateOrder(orderId: number, order: OrderHeaderForm): Observable<OrderHeader> {
    const {file_pdf, ...dtoOrder} = order;
    
    return this.httpClient.put<OrderHeaderDto>(`${this.baseUrl}/${orderId}`, dtoOrder)
    .pipe(
      map(OrderMapper.fromDto)
    );
  }

  deleteLine(orderId: number, lineId: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.baseUrl}/${orderId}/lines/${lineId}`);
  }

  getStatuses(): Observable<StatusOption[]> {
    return this.httpClient.get<StatusOption[]>(`${this.baseUrl}/statuses`);
  }
}