import { Component, effect, inject, input, signal } from '@angular/core'
import { Router, RouterModule } from '@angular/router'
import { ProductsService } from '../products-service'
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { Product } from '../model/product.model'
import { ProgressSpinner } from 'primeng/progressspinner'
import { CardModule } from 'primeng/card'
import { Button } from 'primeng/button'
import { InputNumberModule } from 'primeng/inputnumber'
import { ToastModule } from 'primeng/toast'
import { Observer } from 'rxjs'
import { InputTextModule } from 'primeng/inputtext'
import { TextareaModule } from 'primeng/textarea'
import { UserInteractionService } from '@angular/core/user-interaction-service'
import { ConfirmDialogModule } from 'primeng/confirmdialog'

@Component({
  selector: 'app-products-form',
  standalone: true,
  imports: [
    ProgressSpinner,
    CardModule,
    ReactiveFormsModule,
    InputTextModule,
    InputNumberModule,
    TextareaModule,
    Button,
    RouterModule,
    InputNumberModule,
    ToastModule,
    ConfirmDialogModule
  ],
  templateUrl: './products-form.html',
  styleUrl: './products-form.scss',
})
export class ProductsForm {
  private interactionUserService = inject(UserInteractionService);
  router: Router = inject(Router)
  productService: ProductsService = inject(ProductsService)

  loading = signal<boolean>(false)
  submitting = signal<boolean>(false)
  deleting = signal<boolean>(false)
  productId = input<number>()

  form = new FormGroup({
    code: new FormControl('', {
      validators: [Validators.required, Validators.minLength(3), Validators.maxLength(10)],
      nonNullable: true,
    }),
    description: new FormControl('', {
      validators: [Validators.required, Validators.maxLength(255)],
      nonNullable: true,
    }),
    price: new FormControl<number>(0, {
      validators: [
        Validators.min(0), // Interdit les prix négatifs
        Validators.max(999999), // Limite optionnelle (ex: 1 million)
        // Pattern pour forcer le format nombre (avec 2 décimales max)
        Validators.pattern(/^\d+(\.\d{1,2})?$/),
      ],
      nonNullable: true,
    }),
  })

  constructor() {
    effect(() => {
      const productId = this.productId()

      if (productId) {
        this.loading.set(true)
        this.productService.getProduct(productId).subscribe((product) => {
          this.form.patchValue({
            code: product.code,
            description: product.description,
            price: product.price,
          })
          this.loading.set(false)
        })
      }
    })
  }

  deleteProduct(event: Event) {
    const currentProductId = this.productId();
    if (currentProductId === undefined) {
      console.warn("Impossible de supprimer le produit en base sans ID de produit");
      return
    }

    this.interactionUserService.confirmDeleting(event, () => {
      this.deleting.set(true)
      this.productService.deleteProduct(currentProductId).subscribe(() => {
        // ! Force => Because we assure that Id is assigned with a correct value !
        this.deleting.set(false)
        void this.router.navigate(['/products'])
        this.interactionUserService.showMessage('success', 'Confirmé', 'Produit supprimé avec succès.')
      })
    });
  }

  submit(): void {
    this.form.markAllAsTouched()
    if (this.form.invalid) return

    const product: Product = this.form.getRawValue()
    const productId = this.productId()

    this.submitting.set(true)

    const observer: Partial<Observer<Product>> = {
      next: () => {
        this.submitting.set(false)
        void this.router.navigate(['/products'])
        if (productId) {
          this.interactionUserService.showMessage('success', 'Updated', 'Le produit est modifié avec succès.')
        } else {
          this.interactionUserService.showMessage('success', 'Created', 'Le produit est créé avec succès.')
        }
      },
      error: (err: any) => {
        this.submitting.set(false)
        if (err.status === 409) {
          // On peut marquer le champ "code" explicitement en erreur
          switch (err.error.field) {
            case 'code':
              this.form.get('code')?.setErrors({ duplicated: true })
              this.interactionUserService.showMessage('warn', 'Doublon', 'Ce code est déjà utilisé par un autre produit.')
              break;
          }
          this.form.get('code')?.setErrors({ duplicated: true })
          this.interactionUserService.showMessage('warn', 'Doublon', 'Ce code est déjà utilisé par un autre produit.')
        } else {
          const errorMessage = err.error?.message || 'Une erreur est survenue'
          this.interactionUserService.showMessage(
            'error',
            'Erreur Serveur',
            'Impossible de sauvegarder le produit. ' + errorMessage,
          )
        }

        console.error('Submit error:', err)
      },
    }

    if (productId) {
      // UPDATE
      this.productService.updateProduct(productId, product).subscribe(observer)
    } else {
      // INSERT
      this.productService.createProduct(product).subscribe(observer)
    }
  }
}
