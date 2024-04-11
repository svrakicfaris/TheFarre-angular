import { Injectable } from '@angular/core';
import { Router } from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private jwt: string | null = null;

  constructor(private router: Router) {
    this.loadToken();
  }

  private loadToken(): void {
    const storedToken = localStorage.getItem('jwt');
    if (storedToken) {
      this.jwt = storedToken;
    }
  }

  setToken(token: string): void {
    this.jwt = token;
    localStorage.setItem('jwt', token);
  }

  getToken(): string | null {
    const token = this.jwt;
    if (token) {
      const tokenData = this.parseJwt(token);
      const expirationDate = new Date(tokenData.exp * 1000);
      const currentDate = new Date();
      if (currentDate > expirationDate) {
        // Token has expired, clear token and log out user
        this.clearToken();
      }
    }
    return token;
  }

  clearToken(): void {
    this.jwt = null;
    localStorage.removeItem('jwt');
    this.router.navigate(['/']);
  }

  isLoggedIn(): boolean {
    return this.jwt !== null;
  }

  private parseJwt(token: string): any {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c: string) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  }
}
