import { Component, computed, effect, inject, input, signal } from '@angular/core'
import { FormGroup, Validators, ReactiveFormsModule, FormControl, FormArray } from '@angular/forms'
import { CommonModule } from '@angular/common'

// Imports PrimeNG
import { ButtonModule } from 'primeng/button'
import { InputTextModule } from 'primeng/inputtext'
import { InputNumberModule } from 'primeng/inputnumber'
import { SelectModule } from 'primeng/select'
import { DatePickerModule } from 'primeng/datepicker'
import { TableModule } from 'primeng/table'
import { ToolbarModule } from 'primeng/toolbar'
import { Card } from 'primeng/card'
import { Router, RouterLink, RouterModule } from '@angular/router'
import { ToastModule } from 'primeng/toast'
import { ProgressSpinnerModule } from 'primeng/progressspinner'
import { OrdersServices } from '../orders-service'
import { CustomerOrder, OrderHeader, ProductOrder } from '../model/order-model'
import { Observer, take } from 'rxjs'
import { TextareaModule } from 'primeng/textarea'
import { DividerModule } from 'primeng/divider'
import { OrderFormHeader } from './order-form-header/order-form-header'
import { OrderFormDetail } from './order-form-detail/order-form-detail'
import { CustomersService } from '../../customers/customers-service'
import { ProductsService } from '../../products/products-service'
import { OrderHeaderForm } from '../model/order-model-form'
import { StatusOption } from '../model/order.status.enum'
import { UserInteractionService } from '@angular/core/user-interaction-service'
import { ConfirmDialogModule } from 'primeng/confirmdialog'
import { VatCode } from '@angular/vatcode/model/vatcode-model'
import { VatCodeService } from '@angular/vatcode/vatcode-service'

@Component({
  selector: 'app-order-form',
  standalone: true,
  imports: [
    OrderFormHeader,
    OrderFormDetail,
    DividerModule,
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    TextareaModule,
    SelectModule,
    DatePickerModule,
    TableModule,
    ToolbarModule,
    Card,
    ToastModule,
    ProgressSpinnerModule,
    RouterModule,
    RouterLink,
    ConfirmDialogModule
  ],
  templateUrl: './order-form.html',
  styleUrl: './order-form.scss',
})
export class OrderForm {
  private interactionUserService = inject(UserInteractionService);
  router: Router = inject(Router);
  orderService: OrdersServices = inject(OrdersServices);
  customerService: CustomersService = inject(CustomersService);
  productService: ProductsService = inject(ProductsService);
  vatCodeService: VatCodeService = inject(VatCodeService);

  loading = signal<boolean>(false);
  submitting = signal<boolean>(false);
  deleting = signal<boolean>(false);
  orderId = input<number>();

  customers = signal<CustomerOrder[]>([]);
  products = signal<ProductOrder[]>([]);
  statuses = signal<StatusOption[]>([]);
  vatCodes = signal<VatCode[]>([]);

  isReadonly = signal(false);


  form = new FormGroup({
    code: new FormControl('', {
      validators: [Validators.required, Validators.minLength(3), Validators.maxLength(20)],
      nonNullable: true,
    }),
    customerId: new FormControl<number | null>(null, Validators.required),
    date: new FormControl<Date>(new Date(), {
      validators: [Validators.required],
      nonNullable: true,
    }),
    status: new FormControl<string>('CREATED', {
      validators: [Validators.required],
      nonNullable: true,
    }),
    filePdf: new FormControl<string>(''),
    orderLines: new FormArray<
      FormGroup<{
        id: FormControl<number | null>
        productId: FormControl<number | null>
        quantity: FormControl<number>
        price: FormControl<number>
        vat_rate: FormControl<number>
      }>
    >([], Validators.required),
  })

  constructor() {
    this.customerService
      .getCustomers()
      .pipe(take(1))
      .subscribe((datas) => {
        // Mapping de Customer (Global) vers CustomerOrder (Spécifique au module Order)
        const mappedCustomers: CustomerOrder[] = datas
          .filter((c) => c.id !== undefined)
          .map((c) => ({
            id: c.id!, // ou la propriété correspondante
            code: c.code,
            name: c.name,
            email: c.email,
          }))
        this.customers.set(mappedCustomers)
      })

    this.productService
      .getProducts()
      .pipe(take(1))
      .subscribe((datas) => {
        const mappedProducts: ProductOrder[] = datas
          .filter((p) => p.id !== undefined)
          .map((p) => ({
            id: p.id!,
            code: p.code,
            description: p.description,
            price: p.price,
          }))
        this.products.set(mappedProducts)
      })

    this.vatCodeService
      .getVatCodes()
      .pipe(take(1))
      .subscribe((datas) => {
        const mappedVatCodes: VatCode[] = datas
          .filter((v) => v.id !== undefined && v.isActive === true)
          .map((v) => ({
            id: v.id,
            code: v.code,
            description: v.description,
            rate: v.rate,
            isActive: v.isActive
          }));
        this.vatCodes.set(mappedVatCodes);
      })

    this.orderService.getStatuses().subscribe(data => this.statuses.set(data));

    effect(() => {
      const orderId = this.orderId()

      if (orderId) {
        this.loading.set(true)
        this.orderService.getOrder(orderId).subscribe((order) => {
          if (order.status === 'CANCELLED' || order.status === 'SHIPPED') {
            this.isReadonly.set(true);
          } else {
            this.isReadonly.set(false);
          }

          this.form.patchValue({
            code: order.code,
            customerId: order.customer.id,
            date: new Date(order.date),
            status: order.status,
            filePdf: order.filePdf,
          });

          const linesArray = this.form.controls.orderLines;
          linesArray.clear();

          order.orderLines.forEach((line) => {
            console.log(line)
            const lineGroup = new FormGroup({
              id: new FormControl<number | null>(line.id!),
              productId: new FormControl<number | null>(line.product.id, Validators.required),
              quantity: new FormControl<number>(line.quantity, {
                nonNullable: true,
                validators: [Validators.required, Validators.min(1)]
              }),
              price: new FormControl<number>(line.price, {
                nonNullable: true,
                validators: [Validators.required]
              }),
              vat_rate: new FormControl<number>(line.vat_rate, {
                nonNullable: true,
                validators: [Validators.required]
              })
            });

            linesArray.push(lineGroup);
          });

          this.loading.set(false)
        })
      }
    })
  }

  deleteOrder(event: Event) {
    const currentOrderId = this.orderId();
    if (currentOrderId === undefined) {
      console.warn("Impossible de supprimer la commande en base sans ID de commande");
      return
    }

    this.interactionUserService.confirmDeleting(event, () => {
      this.deleting.set(true);

      this.orderService.deleteOrder(currentOrderId).subscribe(() => {
        // ! Force => Because we assure that Id is assigned with a correct value !
        this.deleting.set(false)
        void this.router.navigate(['/orders'])
        this.interactionUserService.showMessage('success', 'Confirmé', 'Commande supprimée avec succés.')
      })
    });
  }

  submit(): void {
    this.form.markAllAsTouched()
    if (this.form.invalid) return

    const rawValues = this.form.getRawValue()

    const order: OrderHeaderForm = {
      code: rawValues.code,
      customer_id: rawValues.customerId!,
      date: new Date(rawValues.date).toISOString(),
      status: rawValues.status,
      file_pdf: rawValues.filePdf ?? '',
      order_lines: (rawValues.orderLines || [])
        .filter((line) => line.productId !== null)
        .map((line) => ({
          id: line.id ? Number(line.id) : undefined,
          product_id: line.productId!, // Le '!' est sûr grâce au filter juste au-dessus
          quantity: line.quantity,
          price: line.price,
          vat_rate: line.vat_rate,
        })),
    }
    const orderId = this.orderId()

    this.submitting.set(true)

    const observer: Partial<Observer<OrderHeader>> = {
      next: () => {
        this.submitting.set(false)
        void this.router.navigate(['/orders'])
        if (orderId) {
          this.interactionUserService.showMessage('success', 'Updated', 'La commande est modifiée avec succès.')
        } else {
          this.interactionUserService.showMessage('success', 'Created', 'La commande est créée avec succès.')
        }
      },
      error: (err: any) => {
        this.submitting.set(false)
        if (err.status === 409) {
          // On peut marquer le champ "code" explicitement en erreur
          switch (err.error.field) {
            case 'code':
              this.form.get('code')?.setErrors({ duplicated: true })
              this.interactionUserService.showMessage('warn', 'Doublon', 'Ce code est déjà utilisé par une autre commande.')
              break;
          }
        } else {
          const errorMessage = err.error?.message || 'Une erreur est survenue'
          this.interactionUserService.showMessage(
            'error',
            'Erreur Serveur',
            'Impossible de sauvegarder la commande. ' + errorMessage,
          )
        }

        console.error('Submit error:', err)
      },
    }

    if (orderId) {
      // UPDATE
      this.orderService.updateOrder(orderId, order).subscribe(observer)
    } else {
      // INSERT
      this.orderService.createOrder(order).subscribe(observer)
    }
  }

  onDeleteLine(actionDel: { id: number, event: Event }) {
    this.interactionUserService.confirmDeleting(actionDel.event, () => {
      const currentOrderId = this.orderId();
      if (currentOrderId === undefined) {
        console.warn("Impossible de supprimer une ligne en base sans ID de commande");
        return;
      }

      // 1. Appel au service pour suppression réelle en DB
      this.orderService.deleteLine(currentOrderId, actionDel.id).subscribe({
        next: () => {
          // 2. Accès au FormArray via votre variable 'this.form'
          const linesArray = this.form.controls.orderLines;

          // 3. Trouver l'index de la ligne qui possède cet ID
          const index = linesArray.controls.findIndex(ctrl => ctrl.get('id')?.value === actionDel.id);

          if (index !== -1) {
            linesArray.removeAt(index);
            this.interactionUserService.showMessage('success', 'Supprimé', 'La ligne a été supprimée.');
          }
        },
        error: (err) => {
          this.interactionUserService.showMessage('error', 'Erreur', 'Impossible de supprimer la ligne.');
          console.error(err);
        }
      });
    });
  }
}
