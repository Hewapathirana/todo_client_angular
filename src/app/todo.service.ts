import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {ApiResponse, TaskRequestDTO, TaskResponseDTO, TaskResponsesDTO} from "./todo/interfaces/todo.interface";

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private apiUrl = 'http://localhost:8080/v1/tasks';

  constructor(private http: HttpClient) { }

  getRecentTasks(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(this.apiUrl);
  }

  createTask(taskRequestDTO: TaskRequestDTO): Observable<TaskResponseDTO> {
    return this.http.post<TaskResponseDTO>(this.apiUrl, taskRequestDTO);
  }

  markTaskAsCompleted(id: number): Observable<TaskResponseDTO> {
    return this.http.put<TaskResponseDTO>(`${this.apiUrl}/${id}/complete`, {});
  }
}
