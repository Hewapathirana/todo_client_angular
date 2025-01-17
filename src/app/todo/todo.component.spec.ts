import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TodoComponent } from './todo.component';
import { TodoService } from '../todo.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { TaskResponseDTO } from './interfaces/todo.interface';

describe('TodoComponent', () => {
  let component: TodoComponent;
  let fixture: ComponentFixture<TodoComponent>;
  let todoService: TodoService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TodoComponent],
      imports: [HttpClientTestingModule, ReactiveFormsModule],
      providers: [TodoService],
    }).compileComponents();

    fixture = TestBed.createComponent(TodoComponent);
    component = fixture.componentInstance;
    todoService = TestBed.inject(TodoService);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form controls with default values', () => {
    expect(component.title?.value).toBe('');
    expect(component.description?.value).toBe('');
  });

  it('should load recent tasks on initialization', () => {
    const mockTasks: TaskResponseDTO[] = [
      { id: 1, title: 'Task 1', description: 'Description 1', isCompleted: false },
      { id: 2, title: 'Task 2', description: 'Description 2', isCompleted: false },
    ];
    // @ts-ignore
    spyOn(todoService, 'getRecentTasks').and.returnValue(of({ data: { taskResponseDTOList: mockTasks } }));
    component.loadRecentTasks();
    fixture.detectChanges();
    expect(component.tasks.length).toBe(2);
    expect(component.tasks[0].title).toBe('Task 1');
  });

  it('should call markAsCompleted and remove task from list', () => {
    const mockTasks: TaskResponseDTO[] = [
      { id: 1, title: 'Task 1', description: 'Description 1', isCompleted: false },
    ];
    component.tasks = mockTasks;
    spyOn(todoService, 'markTaskAsCompleted').and.returnValue(of(mockTasks[0]));
    component.markAsCompleted(1);
    fixture.detectChanges();
    expect(component.tasks.length).toBe(0); // Task should be removed from the list
  });

  it('should call createTask and reset form if the form is valid', () => {
    const mockTask: TaskResponseDTO = { id: 1, title: 'New Task', description: 'Description', isCompleted: false };
    component.taskForm.setValue({ title: 'New Task', description: 'Description' });
    spyOn(todoService, 'createTask').and.returnValue(of(mockTask));
    spyOn(component, 'loadRecentTasks');

    component.createTask();
    fixture.detectChanges();
    expect(todoService.createTask).toHaveBeenCalled();
    expect(component.taskForm.value.title).toBe(null); // Form should be reset
    expect(component.taskForm.value.description).toBe(null);
    expect(component.loadRecentTasks).toHaveBeenCalled();
  });

  it('should not call createTask if form is invalid', () => {
    component.taskForm.setValue({ title: '', description: '' });
    spyOn(todoService, 'createTask');
    component.createTask();
    fixture.detectChanges();
    expect(todoService.createTask).not.toHaveBeenCalled(); // Form should not be valid, so no task should be created
  });

  it('should display validation errors for invalid form inputs', () => {
    component.taskForm.setValue({ title: '', description: '' });
    fixture.detectChanges();
    const titleInput = fixture.nativeElement.querySelector('[formControlName="title"]');
    const descriptionInput = fixture.nativeElement.querySelector('[formControlName="description"]');
    titleInput.dispatchEvent(new Event('blur'));
    descriptionInput.dispatchEvent(new Event('blur'));
    fixture.detectChanges();
    const errorMessages = fixture.nativeElement.querySelectorAll('.error');
    expect(errorMessages.length).toBeGreaterThan(0); // Should display validation error messages
  });
});
