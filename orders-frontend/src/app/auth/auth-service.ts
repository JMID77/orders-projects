import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core'
import { environment } from 'environments/environment';
import { AuthPost, AuthStorage } from './model/auth-model';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  httpClient: HttpClient = inject(HttpClient);
  baseUrl: string = environment.apiUrl + 'auth';
  private TOKEN_KEY = 'access_token';

  private userStorage = signal<AuthStorage | null>(this.getToken());
  readonly isLoggedIn = computed(() => !!this.userStorage());
  readonly isAdmin = computed(() => this.userStorage()?.user.is_admin ?? false);
  readonly email = computed(() => this.userStorage()?.user.email ?? '');

  register(register: AuthPost): Observable<AuthStorage> {
    return this.httpClient.post<AuthStorage>(`${this.baseUrl}/register`, register).pipe(tap(currentToken => this.saveToken(currentToken)));
  }

  login(login: AuthPost): Observable<AuthStorage> {
    return this.httpClient.post<AuthStorage>(`${this.baseUrl}/login`, login).pipe(tap(currentToken => this.saveToken(currentToken)));
  }

  saveToken(token: AuthStorage) {
    this.userStorage.set(token);
    localStorage.setItem(this.TOKEN_KEY, JSON.stringify(token));
  }

  getToken(): AuthStorage | null {
    const storedUser = localStorage.getItem(this.TOKEN_KEY);

    if (!storedUser) {
      return null;
    }

    return JSON.parse(storedUser) as AuthStorage;
  }

  isLogged(): boolean {
    const token: AuthStorage | null = this.getToken();

    if (!token) {
      return false;
    }
    return true;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  logout() {
    this.userStorage.set(null);
    localStorage.removeItem(this.TOKEN_KEY);
  }
}
