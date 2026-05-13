// user-interaction.service.ts
import { Injectable, signal } from '@angular/core';

export interface Toast {
  type: 'success' | 'error' | 'warn';
  title: string;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class UserInterPureService {
  toast = signal<Toast | null>(null);

  showMessage(type: 'success' | 'error' | 'warn', title: string, message: string) {
    this.toast.set({ type, title, message });
    setTimeout(() => this.toast.set(null), 3000);
  }

  confirm(message: string): boolean {
    // Utilisation du confirm natif pour la simplicité, 
    // ou vous pouvez déclencher une modale personnalisée ici.
    return window.confirm(message);
  }
}
