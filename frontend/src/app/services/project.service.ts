import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProjectDTO } from './types/project';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProjectsService {
  private apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {}
  getAllProjects(title?: string): Observable<ProjectDTO[]> {
    const params = title ? { title } : undefined;
    return this.http.get<ProjectDTO[]>(`${this.apiUrl}/projects`, { params });
  }

  updateProject(
    id: number,
    title: string,
    description: string
  ): Observable<ProjectDTO> {
    const updatedProject = { title, description };
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${localStorage.getItem('token')}`
    );
    return this.http.patch<ProjectDTO>(
      `${this.apiUrl}/projects/${id}`,
      updatedProject,
      { headers }
    );
  }

  deleteProject(id: number) {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${localStorage.getItem('token')}`
    );
    return this.http.delete(`${this.apiUrl}/projects/${id}`, {
      headers,
    });
  }

  createProject(title: string, description: string): Observable<ProjectDTO> {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${localStorage.getItem('token')}`
    );
    const newProject = { title, description };
    return this.http.post<ProjectDTO>(`${this.apiUrl}/projects`, newProject, {
      headers,
    });
  }

  addParticipant(projectId: number, userId: number): Observable<ProjectDTO> {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${localStorage.getItem('token')}`
    );
    return this.http.post<ProjectDTO>(
      `${this.apiUrl}/projects/${projectId}/participants/${userId}`,
      {},
      { headers }
    );
  }

  getAllUsers(): Observable<any[]> {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${localStorage.getItem('token')}`
    );
    return this.http.get<any[]>(`${this.apiUrl}/users`, { headers });
  }

  getProjectById(id: number): Observable<ProjectDTO> {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${localStorage.getItem('token')}`
    );
    return this.http.get<ProjectDTO>(`${this.apiUrl}/projects/${id}`, {
      headers,
    });
  }

  removeParticipant(projectId: number, userId: number): Observable<ProjectDTO> {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${localStorage.getItem('token')}`
    );
    return this.http.post<ProjectDTO>(
      `${this.apiUrl}/projects/${projectId}/remove-participant/${userId}`,
      {},
      { headers }
    );
  }
}
