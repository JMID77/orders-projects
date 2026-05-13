// toast.component.ts
import { Component, inject } from '@angular/core';
import { UserInterPureService } from './user-inter-pure';

@Component({
  selector: 'app-toast',
  standalone: true,
  template: `
    @if (ui.toast(); as t) {
      <div [class]="'fixed top-5 right-5 p-4 rounded shadow-lg z-50 text-white ' + 
        (t.type === 'success' ? 'bg-green-600' : t.type === 'error' ? 'bg-red-600' : 'bg-orange-500')">
        <strong>{{ t.title }}</strong>: {{ t.message }}
      </div>
    }
  `
})
export class ToastComponent { ui = inject(UserInterPureService); }
