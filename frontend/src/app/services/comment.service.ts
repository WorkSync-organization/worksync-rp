import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, lastValueFrom } from 'rxjs';
import { ErrorMessage } from './types/error';
import { CommentRequest, CommentResponse } from './types/comment';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  private apiUrl = `${environment.apiUrl}/comments`;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token não encontrado. Usuário não autenticado.');
    }
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  async createComment(
    description: string,
    taskId: number,
    userId: number
  ): Promise<CommentResponse> {
    const headers = this.getAuthHeaders();
    const response$ = this.http.post<CommentResponse>(
      this.apiUrl,
      { description, taskId, userId },
      { headers }
    );
    return lastValueFrom(response$);
  }

  getCommentsByTask(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/task/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }

  deleteComment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }
}
