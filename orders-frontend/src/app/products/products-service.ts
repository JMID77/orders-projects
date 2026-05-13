import { HttpClient } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { environment } from '../../environments/environment'
import { map, Observable } from 'rxjs';
import { Product, ProductDto, ProductMapper } from './model/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  httpClient: HttpClient = inject(HttpClient)
  baseUrl: string = environment.apiUrl + 'products'

  getProducts(): Observable<Product[]> {
    return this.httpClient.get<ProductDto[]>(this.baseUrl)
    .pipe(
      map(ProductMapper.fromDtos)
    );
  }

  getProduct(productId: number): Observable<Product> {
    return this.httpClient.get<ProductDto>(`${this.baseUrl}/${productId}`)
    .pipe(
      map(ProductMapper.fromDto)
    );
  }

  deleteProduct(productId: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.baseUrl}/${productId}`);
  }

  createProduct(product: Product): Observable<Product> {
    return this.httpClient.post<ProductDto>(this.baseUrl, ProductMapper.toDto(product))
    .pipe(
      map(ProductMapper.fromDto)
    );
  }

  updateProduct(productId: number, product: Product): Observable<Product> {
    return this.httpClient.put<ProductDto>(`${this.baseUrl}/${productId}`, ProductMapper.toDto(product))
    .pipe(
      map(ProductMapper.fromDto)
    );
  }
}
