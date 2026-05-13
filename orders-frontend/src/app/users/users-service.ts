import { HttpClient } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { environment } from 'environments/environment';
import { map, Observable } from 'rxjs';
import { User, UserDto, UserMapper } from './model/user.model';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private httpClient: HttpClient = inject(HttpClient);
  private baseUrl: string = environment.apiUrl + 'users';

  getUsers(): Observable<User[]> {
    return this.httpClient.get<UserDto[]>(this.baseUrl)
    .pipe(
      map(UserMapper.fromDtos)
    );
  }

  getUser(idUser: number): Observable<User> {
    return this.httpClient.get<UserDto>(`${this.baseUrl}/${idUser}`)
    .pipe(
      map(UserMapper.fromDto)
    );
  }

  deleteUser(idUser: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.baseUrl}/${idUser}`);
  }

  createUser(user: User): Observable<User> {
    return this.httpClient.post<UserDto>(this.baseUrl, UserMapper.toDto(user))
    .pipe(
      map(UserMapper.fromDto)
    );
  }
  
  updateUser(idUser: number, user: User): Observable<User> {
    return this.httpClient.put<UserDto>(`${this.baseUrl}/${idUser}`, UserMapper.toDto(user))
    .pipe(
      map(UserMapper.fromDto)
    );
  }
}
