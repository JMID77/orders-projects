import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core'
import { environment } from 'environments/environment';
import { AuthPost, UserStorage } from './model/auth-model';
import { Observable, tap } from 'rxjs';
import { UserDto } from '@angular/users/model/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  httpClient: HttpClient = inject(HttpClient);
  baseUrl: string = environment.apiUrl + 'auth';
  private USER_LOCAL = 'user_local';

  private userStorage = signal<UserDto | null>(this.getUserStorage());
  readonly isLoggedIn = computed(() => !!this.userStorage());
  readonly isAdmin = computed(() => this.userStorage()?.is_admin ?? false);
  readonly email = computed(() => this.userStorage()?.email ?? '');

  register(register: AuthPost): Observable<UserDto> {
    return this.httpClient.post<UserDto>(`${this.baseUrl}/register`, register).pipe(tap(currentUser => this.saveToken(currentUser)));
  }

  login(login: AuthPost): Observable<UserDto> {
    return this.httpClient.post<UserDto>(`${this.baseUrl}/login`, login).pipe(tap(currentUser => this.saveToken(currentUser)));
  }

  saveToken(user: UserDto) {
    this.userStorage.set(user);
    localStorage.setItem(this.USER_LOCAL, JSON.stringify(user));
  }

  getUserStorage(): UserDto | null {
    const storedUser = localStorage.getItem(this.USER_LOCAL);
    console.log('UserStorage', storedUser)
    if (!storedUser) {
      return null;
    }

    return JSON.parse(storedUser) as UserDto;
  }

  isLogged(): boolean {
    const user: UserDto | null = this.getUserStorage();

    if (!user) {
      return false;
    }
    return true;
  }

  isAuthenticated(): boolean {
    return !!this.getUserStorage();
  }

  logout() {
    this.httpClient.post(`${this.baseUrl}/logout`, {});
    this.userStorage.set(null);
    localStorage.removeItem(this.USER_LOCAL);
  }
}
