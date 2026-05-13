import { Component, inject, signal, WritableSignal } from '@angular/core'
import { ProductsService } from '../products-service'
import { Product } from '../model/product.model'
import { ProgressSpinnerModule } from 'primeng/progressspinner'
import { ToastModule } from 'primeng/toast'
import { ToolbarModule } from 'primeng/toolbar'
import { ButtonModule } from 'primeng/button'
import { TableModule } from 'primeng/table'
import { IconFieldModule } from 'primeng/iconfield'
import { InputIconModule } from 'primeng/inputicon'
import { RouterLink } from '@angular/router'
import { InputTextModule } from 'primeng/inputtext'
import { MenuModule } from 'primeng/menu'
import { CurrencyPipe } from '@angular/common'
import { UserInteractionService } from '@angular/core/user-interaction-service'
import { ConfirmDialogModule } from 'primeng/confirmdialog'

@Component({
  selector: 'app-products-list',
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
    CurrencyPipe,
    ConfirmDialogModule
  ],
  templateUrl: './products-list.html',
  styleUrl: './products-list.scss',
})
export class ProductsList {
  private interactionUserService = inject(UserInteractionService);
  private productService = inject(ProductsService)

  deleting = signal<boolean>(false)

  selectedProducts!: Product[] | null
  selectedProduct: Product | null = null

  loading: WritableSignal<boolean> = signal(true)
  products = signal<Product[]>([])

  constructor() {
    this.loadProducts()
  }

  private loadProducts() {
    this.loading.set(true)
    this.productService.getProducts().subscribe((datas) => {
      this.products.set(datas)
      this.loading.set(false)
    })
  }

  deleteRecord(product: Product, event: Event) {
    const currentProductId = product.id;
    if (currentProductId === undefined) {
      console.warn("Impossible de supprimer le produit en base sans ID de produit");
      return
    }

    this.interactionUserService.confirmDeleting(event, () => {
      this.deleting.set(true)
      this.productService.deleteProduct(currentProductId).subscribe(() => {
        this.products.update((prev) => prev.filter((c) => c.id !== currentProductId))
        this.deleting.set(false)
        this.interactionUserService.showMessage('success', 'Confirmé', 'Produit supprimé avec succés.')
      })
    });
  }
}
