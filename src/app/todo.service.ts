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

  // Get the most recent tasks (limit to 5)
  getRecentTasks(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(this.apiUrl);
  }

  // Create a new task
  createTask(taskRequestDTO: TaskRequestDTO): Observable<TaskResponseDTO> {
    return this.http.post<TaskResponseDTO>(this.apiUrl, taskRequestDTO);
  }

  // Mark task as completed
  markTaskAsCompleted(id: number): Observable<TaskResponseDTO> {
    return this.http.post<TaskResponseDTO>(`${this.apiUrl}/${id}/complete`, {});
  }
}
