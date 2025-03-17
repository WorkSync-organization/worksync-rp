import { Injectable } from '@angular/core';
import { User, UserDTO } from '../types/user';
import { ErrorMessage } from '../types/error';
import { jwtDecode } from 'jwt-decode';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) {}

  register(
    name: string,
    email: string,
    password: string,
    role: string
  ): Promise<{ error: ErrorMessage } | Response> {
    return new Promise((resolve, _) => {
      this.http
        .post(`${this.apiUrl}/register`, { name, email, password, role })
        .subscribe(
          (response) => {
            resolve(response as Response);
          },
          (error) => {
            const errorMessage: ErrorMessage = error.error;
            resolve({ error: errorMessage });
          }
        );
    });
  }

  async login(
    email: string,
    password: string
  ): Promise<{ error: ErrorMessage } | Response> {
    const response = await fetch(`${this.apiUrl}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorMessage = await response.json();
      return { error: errorMessage as ErrorMessage };
    }

    const data = await response.json();
    const decodedToken = jwtDecode(data.token);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(decodedToken));
    return response;
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  isAuthenticated(): boolean {
    if (typeof localStorage === 'undefined') {
      return false;
    }
    return !!localStorage.getItem('token');
  }

  getUser(): User | null {
    const user = localStorage.getItem('user');
    return user ? (JSON.parse(user) as User) : null;
  }
}
