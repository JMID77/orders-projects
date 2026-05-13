import { Component, inject, signal } from '@angular/core'
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Button } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { AuthService } from '../auth-service';
import { InputText } from 'primeng/inputtext';
import { Password } from "primeng/password";
import { AuthPost } from '../model/auth-model';
import { ToastModule } from 'primeng/toast';
import { UserInteractionService } from '@angular/core/user-interaction-service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ CardModule, ReactiveFormsModule, Button, InputText, Password, ToastModule ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private interactionUserService = inject(UserInteractionService);
  authService = inject(AuthService);
  router = inject(Router);

  mode = signal<'login' | 'register'>('login');

  submitting = signal<boolean>(false);

  form = new FormGroup({
    name: new FormControl<string | null>(null),
    email: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    password: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(4)] }),
  })

  toggleMode(): void {
    this.mode.update(value => value === 'login' ? 'register' : 'login');
  }

  submit(): void {
    this.form.markAsTouched();
    if (this.form.invalid) return

    this.submitting.set(true);
    const authForm: AuthPost = {
      email: this.form.value.email!,
      password: this.form.value.password!,
      ...(this.mode() === 'register' && { name: this.form.value.name! })
    };

    if (this.mode() === 'login') {
      this.login(authForm);
    } else {
      this.register(authForm);
    }
  }

  login(authForm: AuthPost): void {
    this.authService.login(authForm).subscribe({
      next: () => {
        void this.router.navigate(['/dashboard']);
        this.submitting.set(false);
      },
      error: () => {
        this.interactionUserService.showMessage('error', 'Error', 'Connection impossible, please try again !');
        this.submitting.set(false);
      }
    });
  }

  register(authForm: AuthPost): void {
    this.authService.register(authForm).subscribe({
      next: () => {
        void this.router.navigate(['/dashboard']);
        this.submitting.set(false);
      },
      error: () => {
        this.interactionUserService.showMessage('error', 'Error', 'Connection impossible, please try again !');
        this.submitting.set(false);
      }
    });
  }
}
