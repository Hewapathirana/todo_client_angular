import { Component, OnInit } from '@angular/core';
import {TaskResponseDTO} from "./interfaces/todo.interface";
import {TodoService} from "../todo.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";


@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.scss']
})
export class TodoComponent implements OnInit {
  tasks: TaskResponseDTO[] = [];
  taskForm: FormGroup; // Reactive form instance

  constructor(private taskService: TodoService, private fb: FormBuilder) {
    // Initialize the form group with controls and validators
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(50)]],
      description: ['', [Validators.required, Validators.maxLength(200)]],
    });
  }

  ngOnInit(): void {
    this.loadRecentTasks();
  }

  // Load recent tasks from the backend
  loadRecentTasks(): void {
    this.taskService.getRecentTasks().subscribe(response => {
      this.tasks = response?.data.taskResponseDTOList?.slice(0, 5);
    });
  }

  // Mark task as completed
  markAsCompleted(taskId: number): void {
    this.taskService.markTaskAsCompleted(taskId).subscribe(() => {
      this.tasks = this.tasks.filter(task => task.id !== taskId); // Remove task from list
    });
  }

  // Create a new task
  createTask(): void {
    if (this.taskForm.valid) {
      const newTask = this.taskForm.value;
      this.taskService.createTask(newTask).subscribe(response => {
        this.loadRecentTasks();
        this.taskForm.reset();
      });
    }
  }

  // Convenience getter for easier access to form controls in the template
  get title() {
    return this.taskForm.get('title');
  }

  get description() {
    return this.taskForm.get('description');
  }
}
