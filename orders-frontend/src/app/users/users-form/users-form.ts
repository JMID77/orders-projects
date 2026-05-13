import { Component, effect, inject, input, signal } from '@angular/core'
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';
import { UsersService } from '../users-service';
import { Router, RouterModule } from '@angular/router';
import { Checkbox, CheckboxModule } from 'primeng/checkbox';
import { Observer } from 'rxjs';
import { User } from '../model/user.model';
import { InputTextModule } from 'primeng/inputtext';
import { UserInteractionService } from '@angular/core/user-interaction-service';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-users-form',
  standalone: true,
  imports: [ ToastModule, ProgressSpinnerModule, CardModule, FormsModule, ReactiveFormsModule, ButtonModule, CheckboxModule, Checkbox, InputTextModule, RouterModule, ConfirmDialogModule ],
  templateUrl: './users-form.html',
  styleUrl: './users-form.scss',
})
export class UsersForm {
  private interactionUserService = inject(UserInteractionService);
  private router: Router = inject(Router);
  private userService: UsersService = inject(UsersService);

  loading = signal(false)
  submitting = signal(false)
  deleting = signal(false)
  userId = input<number>()

  form = new FormGroup({
    name: new FormControl('', {
      validators: [Validators.required, Validators.minLength(5), Validators.maxLength(150)],
      nonNullable: true,
    }),
    email: new FormControl('', {
      validators: [
        Validators.required,
        Validators.maxLength(255),
        Validators.email,
        Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
      ],
      nonNullable: true,
    }),
    isAdmin: new FormControl(false, {
      validators: [Validators.required],
      nonNullable: true,
    }),
    isActive: new FormControl((this.userId() ? false : true), {
      validators: [Validators.required],
      nonNullable: true,
    }),
  })

  constructor() {
    effect(() => {
      const userId = this.userId()

      if (userId) {
        this.loading.set(true)
        this.userService.getUser(userId).subscribe((user) => {
          this.form.patchValue({
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            isActive: user.isActive,
          })
          this.loading.set(false)
        })
      }
    })
  }

  deleteUser(event: Event) {
    const currentUserId = this.userId();
    if (currentUserId === undefined) {
      console.warn("Impossible de supprimer l'utilisateur en base sans ID d'utilisateur");
      return
    }
    this.deleting.set(true)
    this.userService.deleteUser(currentUserId).subscribe(() => {
      // ! Force => Because we assure that Id is assigned with a correct value !
      this.deleting.set(false)
      void this.router.navigate(['/users'])
      this.interactionUserService.showMessage('success', 'Confirmé', 'Utilisateur supprimé avec succès.')
    })
  }

  submit(): void {
    this.form.markAllAsTouched()
    if (this.form.invalid) return

    const user: User = this.form.getRawValue()
    const userId = this.userId()

    this.submitting.set(true)

    const observer: Partial<Observer<User>> = {
      next: () => {
        this.submitting.set(false)
        void this.router.navigate(['/users'])
         if (userId) {
          this.interactionUserService.showMessage('success', 'Updated', 'L\'utilisateur est modifié avec succès.')
        } else {
          this.interactionUserService.showMessage('success', 'Created', 'L\'utilisateur est créé avec succès.')
        }
      },
      error: (err: any) => {
        this.submitting.set(false)
        if (err.status === 409) {
          // On peut marquer le champ "code" explicitement en erreur
          switch (err.error.field) {
            case 'name':
              this.form.get('name')?.setErrors({ duplicated: true })
              this.interactionUserService.showMessage('warn', 'Doublon', 'Ce nom est déjà utilisé par un autre utilisateur.')
              break;
            case 'email':
              this.form.get('email')?.setErrors({ duplicated: true })
              this.interactionUserService.showMessage('warn', 'Doublon', 'Cet email est déjà utilisé par un autre utilisateur.')
              break;
          }
        } else {
          const errorMessage = err.error?.message || 'Une erreur est survenue'
          this.interactionUserService.showMessage(
            'error',
            'Erreur Serveur',
            'Impossible de sauvegarder l\'utilisateur. ' + errorMessage,
          )
        }

        console.error('Submit error:', err)
      },
    }

    if (userId) {
      // UPDATE
      this.userService.updateUser(userId, user).subscribe(observer)
    } else {
      // INSERT
      this.userService.createUser(user).subscribe(observer)
    }
  }
}
