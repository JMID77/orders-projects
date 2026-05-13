import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './navbar/navbar';
import { ConfirmationService } from 'primeng/api';
import { UserInteractionService } from './core/user-interaction-service';
import { ToastModule, Toast } from 'primeng/toast';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, Toast],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  providers: [ConfirmationService, UserInteractionService, ToastModule ]
})
export class App {}
