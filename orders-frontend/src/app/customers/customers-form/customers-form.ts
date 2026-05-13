import { Component, effect, inject, input, signal } from '@angular/core'
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { Router, RouterModule } from '@angular/router'
import { CustomersService } from '../customers-service'
import { ProgressSpinner } from 'primeng/progressspinner'
import { CardModule } from 'primeng/card'
import { Button } from 'primeng/button'
import { Customer } from '../model/customer.model'
import { Observer } from 'rxjs'
import { ToastModule } from 'primeng/toast'
import { InputTextModule } from 'primeng/inputtext'
import { TextareaModule } from 'primeng/textarea'
import { UserInteractionService } from '@angular/core/user-interaction-service'
import { ConfirmDialogModule } from 'primeng/confirmdialog'

@Component({
  selector: 'app-customers-form',
  standalone: true,
  imports: [
    ProgressSpinner,
    InputTextModule,
    TextareaModule,
    CardModule,
    ReactiveFormsModule,
    Button,
    RouterModule,
    ToastModule,
    ConfirmDialogModule
  ],
  templateUrl: './customers-form.html',
  styleUrl: './customers-form.scss',
})
export class CustomersForm {
  private interactionUserService = inject(UserInteractionService);
  router: Router = inject(Router)
  customerService: CustomersService = inject(CustomersService)

  loading = signal<boolean>(false)
  submitting = signal<boolean>(false)
  deleting = signal<boolean>(false)
  customerId = input<number>()

  form = new FormGroup({
    code: new FormControl('', {
      validators: [Validators.required, Validators.minLength(3), Validators.maxLength(10)],
      nonNullable: true,
    }),
    name: new FormControl('', {
      validators: [Validators.required, Validators.maxLength(100)],
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
    address: new FormControl('', {
      validators: [Validators.required, Validators.maxLength(500)],
      nonNullable: true,
    }),
  })

  constructor() {
    effect(() => {
      const customerId = this.customerId()

      if (customerId) {
        this.loading.set(true)
        this.customerService.getCustomer(customerId).subscribe((customer) => {
          this.form.patchValue({
            code: customer.code,
            name: customer.name,
            email: customer.email,
            address: customer.address,
          })
          this.loading.set(false)
        })
      }
    })
  }

  deleteCustomer(event: Event) {
    const currentCustomerId = this.customerId();
    if (currentCustomerId === undefined) {
      console.warn("Impossible de supprimer le client en base sans ID de client");
      return
    }
    
    this.interactionUserService.confirmDeleting(event, () => {
      this.deleting.set(true)
      this.customerService.deleteCustomer(currentCustomerId).subscribe(() => {
        // ! Force => Because we assure that Id is assigned with a correct value !
        this.deleting.set(false)
        void this.router.navigate(['/customers'])
        this.interactionUserService.showMessage('success', 'Confirmé', 'Client supprimé avec succès.')
      })
    });
  }

  submit(): void {
    this.form.markAllAsTouched()
    if (this.form.invalid) return

    const customer: Customer = this.form.getRawValue()
    const customerId = this.customerId()

    this.submitting.set(true)

    const observer: Partial<Observer<Customer>> = {
      next: () => {
        this.submitting.set(false)
        void this.router.navigate(['/customers'])
        if (customerId) {
          this.interactionUserService.showMessage('success', 'Updated', 'Le client est modifié avec succès.')
        } else {
          this.interactionUserService.showMessage('success', 'Created', 'Le client est créé avec succès.')
        }
      },
      error: (err: any) => {
        this.submitting.set(false)
        if (err.status === 409) {
          // On peut marquer le champ "code" explicitement en erreur
          switch (err.error.field) {
            case 'code':
              this.form.get('code')?.setErrors({ duplicated: true })
              this.interactionUserService.showMessage('warn', 'Doublon', 'Ce code est déjà utilisé par un autre client.')
              break;
          }
        } else {
          const errorMessage = err.error?.message || 'Une erreur est survenue'
          this.interactionUserService.showMessage(
            'error',
            'Erreur Serveur',
            'Impossible de sauvegarder le client. ' + errorMessage,
          )
        }

        console.error('Submit error:', err)
      },
    }

    if (customerId) {
      // UPDATE
      this.customerService.updateCustomer(customerId, customer).subscribe(observer)
    } else {
      // INSERT
      this.customerService.createCustomer(customer).subscribe(observer)
    }
  }
}
