import { Component, inject, signal } from '@angular/core'
import { UsersService } from '../users-service'
import { User } from '../model/user.model';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { UserInteractionService } from '@angular/core/user-interaction-service';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [ProgressSpinnerModule, ToastModule, ToolbarModule, ButtonModule, InputTextModule, TableModule, IconFieldModule, InputIconModule, RouterLink, CommonModule, ConfirmDialogModule],
  templateUrl: './users-list.html',
  styleUrl: './users-list.scss',
})
export class UsersList {
  private userService: UsersService = inject(UsersService);
  private interactionUserService = inject(UserInteractionService);

  deleting = signal(false);

  selectedUsers: User[] | null;
  selectedUser: User | null = null;

  loading = signal(false);
  users = signal<User[]>([]);


  constructor() {
    this.loadUsers()
  }

  loadUsers() {
    this.loading.set(true);
    this.userService.getUsers().subscribe((datas) => {
      this.users.set(datas);
      this.loading.set(false);
    })
  }

  deleteRecord(user: User, event: Event) {
    const currentUserId = user.id;
    if (currentUserId === undefined) {
      console.warn("Impossible de supprimer l'utilisateur en base sans ID d'utilisateur");
      return
    }

    this.interactionUserService.confirmDeleting(event, () => {
      this.deleting.set(true);
      this.userService.deleteUser(currentUserId).subscribe((data) => {
        this.users.update((prev) => prev.filter((u) => u.id !== currentUserId));
        this.deleting.set(false);
        this.interactionUserService.showMessage('success', 'Confirmé', 'Utilisateur supprimé avec succés.')
      })
    });
  }


  
}
