import { inject, Injectable } from '@angular/core'
import { ConfirmationService, MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class UserInteractionService {
  private messageService: MessageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);

  showMessage(severity: string, summary: string, detail: string) {
    this.messageService.add({
      severity: severity,
      summary: summary,
      detail: detail,
    })
  }

  confirmDeleting(event: Event, onAccept: () => void) {
    this.confirmationService.confirm({
            target: event.target as EventTarget,
            message: 'Voulez-vous supprimer cette donnée définitivement ?',
            header: 'Danger Zone',
            icon: 'pi pi-info-circle',
            rejectLabel: 'Cancel',
            rejectButtonProps: {
                label: 'Cancel',
                severity: 'secondary',
                outlined: true
            },
            acceptButtonProps: {
                label: 'Delete',
                severity: 'danger'
            },
        
            accept: () => {
              onAccept();
            },
            reject: () => {
                this.messageService.add({ severity: 'error', summary: 'Rejeté', detail: 'Vous avez annulé la demande de suppression' });
            }
        });
  }
}
