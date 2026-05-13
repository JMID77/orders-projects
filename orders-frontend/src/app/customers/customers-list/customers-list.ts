import { Component, inject, Signal, signal, WritableSignal } from '@angular/core'
import { CustomersService } from '../customers-service'
import { Customer } from '../model/customer.model'

// Imports PrimeNG
import { TableModule } from 'primeng/table'
import { ButtonModule } from 'primeng/button'
import { InputTextModule } from 'primeng/inputtext'
import { MenuModule } from 'primeng/menu'
import { ToastModule } from 'primeng/toast'
import { ProgressSpinnerModule } from 'primeng/progressspinner'
import { ToolbarModule } from 'primeng/toolbar'
import { IconFieldModule } from 'primeng/iconfield'
import { InputIconModule } from 'primeng/inputicon'
import { RouterLink } from '@angular/router'
import { UserInteractionService } from '@angular/core/user-interaction-service'
import { ConfirmDialogModule } from 'primeng/confirmdialog'

@Component({
  selector: 'app-customers-list',
  standalone: true,
  imports: [
    TableModule,
    ButtonModule,
    InputTextModule,
    MenuModule,
    ProgressSpinnerModule,
    ToolbarModule,
    ToastModule,
    IconFieldModule,
    InputIconModule,
    ToastModule,
    RouterLink,
    ConfirmDialogModule
  ],
  templateUrl: './customers-list.html',
  styleUrl: './customers-list.scss',
})
export class CustomersList {
  private interactionUserService = inject(UserInteractionService);
  private customerService = inject(CustomersService)

  deleting = signal<boolean>(false)

  selectedCustomers!: Customer[] | null
  selectedCustomer: Customer | null = null

  loading: WritableSignal<boolean> = signal(true)
  customers = signal<Customer[]>([])

  constructor() {
    this.loadCustomers()
  }

  private loadCustomers() {
    this.loading.set(true)
    this.customerService.getCustomers().subscribe((datas) => {
      this.customers.set(datas)
      this.loading.set(false)
    })
  }

  deleteRecord(customer: Customer, event: Event) {
    const currentCustomerId = customer.id;
    if (currentCustomerId === undefined) {
      console.warn("Impossible de supprimer le client en base sans ID de cient");
      return
    }

    this.interactionUserService.confirmDeleting(event, () => {
      this.deleting.set(true)
      this.customerService.deleteCustomer(currentCustomerId).subscribe(() => {
        this.customers.update((prev) => prev.filter((c) => c.id !== currentCustomerId))
        this.deleting.set(false)
        this.interactionUserService.showMessage('success', 'Deleted', 'Customer deleted with success.')
      })
    });
  }
}
