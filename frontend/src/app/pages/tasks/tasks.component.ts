import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { TaskService } from '../../services/tasks.service';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { AuthService } from '../../services/auth/auth.service';
import { UserService } from '../../services/user.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-tasks',
  standalone: true,
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css'],
  imports: [CommonModule, RouterModule, NavbarComponent],
})
export class TasksComponent implements OnInit {
  tasks: any[] = [];
  filteredTasks: any[] = [];
  searchQuery: string = '';
  startDate: string = '';
  endDate: string = '';
  creatorId: string = '';
  assignedPersonId: string = '';
  statusFilter: string = '';
  username: string = '';
  currentUserId!: number;
  userRole: string | null = null;

  private router = inject(Router);
  private authService = inject(AuthService);
  private userService = inject(UserService);

  constructor(private taskService: TaskService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    const userLog = this.authService.getUser();
    if (userLog && userLog.sub) {
      this.username = userLog.sub;
      this.userRole = userLog.role;
    }

    this.userService.getUserByEmail(this.username).subscribe({
      next: (user) => {
        this.currentUserId = user.id;
        this.loadTasks(); 
      },
      error: (err) => {
        console.error('Erro ao buscar o usuário:', err);
      },
    });
  }

  loadTasks(): void {
    const creatorTasks$ = this.taskService.getSearchTasks(
      this.currentUserId.toString(),
      '',
      this.statusFilter,
      this.startDate,
      this.endDate,
      this.searchQuery
    );

    const assignedTasks$ = this.taskService.getSearchTasks(
      '',
      this.currentUserId.toString(),
      this.statusFilter,
      this.startDate,
      this.endDate,
      this.searchQuery
    );

    forkJoin([creatorTasks$, assignedTasks$]).subscribe({
      next: ([creatorTasks, assignedTasks]) => {
        if (!Array.isArray(creatorTasks)) {
          creatorTasks = []; 
        }

        if (!Array.isArray(assignedTasks)) {
          assignedTasks = []; 
        }

        const allTasksMap = new Map();

        [...creatorTasks, ...assignedTasks].forEach(task => {
          if (!allTasksMap.has(task.id)) {
            allTasksMap.set(task.id, task);
          }
        });

        this.tasks = Array.from(allTasksMap.values());
        this.applyFilters();
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Erro ao buscar tarefas', err),
    });
  }


  onSearchChange(event: Event): void {
    this.searchQuery = (event.target as HTMLInputElement).value.toLowerCase();
    this.applyFilters();
  }

  onStartDateChange(event: Event): void {
    this.startDate = (event.target as HTMLInputElement).value;
    this.applyFilters();
  }

  onEndDateChange(event: Event): void {
    this.endDate = (event.target as HTMLInputElement).value;
    this.applyFilters();  
  }

  // Novo método para filtrar pelo status
  onStatusChange(event: Event): void {
    this.statusFilter = (event.target as HTMLSelectElement).value;
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredTasks = this.tasks.filter(task => {
      const titleMatch = task.title.toLowerCase().includes(this.searchQuery);
      const startDateMatch = this.startDate ? new Date(task.startDate) >= new Date(this.startDate) : true;
      const endDateMatch = this.endDate ? new Date(task.startDate) <= new Date(this.endDate) : true;
      const statusMatch = this.statusFilter ? task.status === this.statusFilter : true; // Filtro de status
      return titleMatch && startDateMatch && endDateMatch && statusMatch;
    });
  }

  deleteTask(id: number): void {
    if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
      this.taskService.deleteTask(id).subscribe({
        next: () => {
          this.tasks = this.tasks.filter((task) => task.id !== id);
          this.applyFilters();
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Erro ao excluir tarefa', err);
        },
      });
    }
  }

  goToCreateTask(): void {
    this.router.navigate(['/create-task']);
  }

  goToEditTask(taskId: number): void {
    this.router.navigate([`/tasks/edit/${taskId}`]);
  }

  goToViewTask(taskId: number): void {
    this.router.navigate([`/tasks/${taskId}`]);
  }

  // Método para traduzir o status
  translateStatus(status: string): string {
    switch (status) {
      case 'NOT_STARTED':
        return 'Não Iniciada';
      case 'IN_PROGRESS':
        return 'Em Andamento';
      case 'DONE':
        return 'Concluída';
      default:
        return 'Desconhecido';
    }
  }
}
