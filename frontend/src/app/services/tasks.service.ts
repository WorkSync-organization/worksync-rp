import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, lastValueFrom } from 'rxjs';
import { ErrorMessage } from './types/error';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private apiUrl = `${environment.apiUrl}/tasks`;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token não encontrado. Usuário não autenticado.');
    }
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  async createTask(
    title: string,
    description: string,
    status: string,
    startDate: string,
    completionDate: string,
    deadline: string,
    responsibleId: number,
    projectId: number
  ): Promise<{ error?: ErrorMessage } | Response> {
    try {
      const response = await lastValueFrom(
        this.http.post(
          `${this.apiUrl}`,
          {
            title,
            description,
            status,
            startDate,
            completionDate,
            deadline,
            responsibleId,
            projectId,
          },
          { headers: this.getAuthHeaders() }
        )
      );
      console.log('Tarefa criada com sucesso:', response);
      return response as Response;
    } catch (error: any) {
      console.error(
        'Erro ao criar tarefa:',
        error.status,
        error.message,
        error.error
      );
      return { error: error.error };
    }
  }

  getTasksByProject(projectId: number): Observable<any[]> {
    try {
      return this.http.get<any[]>(`${this.apiUrl}/projects/${projectId}`, {
        headers: this.getAuthHeaders(),
      });
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      } else {
        console.error('Unknown error occurred');
      }
      return new Observable();
    }
  }

  getTaskById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }

  async updateTask(
    id: number,
    updatedTask: any
  ): Promise<{ error?: ErrorMessage } | Response> {
    try {
      console.log('Atualizando tarefa...', updatedTask); // Log para depuração
      const response = await lastValueFrom(
        this.http.patch(`${this.apiUrl}/${id}`, updatedTask, {
          headers: this.getAuthHeaders(),
        })
      );
      console.log(`Tarefa ${id} atualizada com sucesso.`, response); // Log para verificar o sucesso da resposta
      return response as Response;
    } catch (error: any) {
      console.error(
        `Erro ao atualizar tarefa ${id}:`,
        error.status,
        error.message,
        error.error
      );
      return { error: error.error };
    }
  }
  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }
}
