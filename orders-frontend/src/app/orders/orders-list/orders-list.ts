import { Component, computed, inject, signal, WritableSignal } from '@angular/core'
import { ToolbarModule } from 'primeng/toolbar'
import { ToastModule } from 'primeng/toast'
import { ProgressSpinnerModule } from 'primeng/progressspinner'
import { TableModule } from 'primeng/table'
import { ButtonModule } from 'primeng/button'
import { OrderHeader, OrderLine } from '../model/order-model'
import { OrdersServices } from '../orders-service'
import { CurrencyPipe, DatePipe } from '@angular/common'
import { RouterLink } from '@angular/router'
import { IconFieldModule } from "primeng/iconfield";
import { InputIconModule } from "primeng/inputicon";
import { InputTextModule } from 'primeng/inputtext'
import { TagModule } from 'primeng/tag';
import { UserInteractionService } from '@angular/core/user-interaction-service'
import { ConfirmDialogModule } from 'primeng/confirmdialog'
import { PdfApiService } from '@angular/core/pdf-api.-service'
import { PdfViewer } from '@angular/core/pdf-viewer/pdf-viewer'
import { EnumTypePdf } from '@angular/core/pdf-api.-service'
import { FormGroup } from '@angular/forms'
import { VatCodeService } from '@angular/vatcode/vatcode-service'
import { VatCode } from '@angular/vatcode/model/vatcode-model'

@Component({
  selector: 'app-orders-list',
  standalone: true,
  imports: [
    ToolbarModule,
    ToastModule,
    ProgressSpinnerModule,
    TableModule,
    ButtonModule,
    CurrencyPipe,
    DatePipe,
    RouterLink,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    TagModule,
    ConfirmDialogModule,
    PdfViewer
  ],
  templateUrl: './orders-list.html',
  styleUrl: './orders-list.scss',
})
export class OrdersList {
  private interactionUserService = inject(UserInteractionService);
  private orderService = inject(OrdersServices)
  private vatCodeService = inject(VatCodeService)

  EnumPdfType = EnumTypePdf;

  expandedRows: { [key: string | number]: boolean } = {}

  cols: any[] = [
    { field: 'code', header: 'Code' },
    { field: 'customer', header: 'Client' },
    { field: 'date', header: 'Date' },
    { field: 'total', header: 'Total' },
  ]

  deleting = signal<boolean>(false);
  printing = signal<boolean>(false)

  selectedOrders!: OrderHeader[] | null
  selectedorder: OrderHeader | null = null

  loading: WritableSignal<boolean> = signal(true)
  private _rawDatas = signal<OrderHeader[]>([])
  private _vatCodes = signal<VatCode[]>([]);

  readonly orders = computed(() => {
    return this._rawDatas().map((order) => ({
      ...order,
      totalAmountHTVA:
        order.orderLines?.reduce((acc, line) => acc + this.computeTotal(line), 0) ?? 0,
      totalAmountTVAC:
        order.orderLines?.reduce((acc, line) => acc + this.computeTotal(line, true), 0) ?? 0,
    }))
  })

  computeTotal(line: OrderLine, withVAT: boolean= false): number {
    let total = 0;
    const quantity = line.quantity ?? 0;
    const price = line.price ?? 0;

    total = (quantity * price)
    
    if (withVAT) {
      const vatId = line.vat_rate ?? -1;
      const vatRate = this._vatCodes()?.find(v => v.id === vatId)?.rate ?? -99;

      if (vatRate !== -99) {
        total = (total * (1 + vatRate / 100));
      }
    }

    return total;
  }

  constructor() {
    this.loadOrders()
  }

  private loadOrders() {
    this.loading.set(true)
    this.orderService.getOrders().subscribe((datas) => {
      this._rawDatas.set(datas)
      this.loading.set(false)
    })

    this.vatCodeService.getVatCodes().subscribe((datas) => {
      this._vatCodes.set(datas);
    })
  }

  deleteRecord(order: OrderHeader, event: Event) {
    const currentOrderId = order.id;
    if (currentOrderId === undefined) {
      console.warn("Impossible de supprimer la commande en base sans ID de commande");
      return
    }

    this.interactionUserService.confirmDeleting(event, () => {
      this.deleting.set(true);
      
      this.orderService.deleteOrder(currentOrderId).subscribe(() => {
        this._rawDatas.update((prev) => prev.filter((c) => c.id !== order.id))
        this.deleting.set(false)
        this.interactionUserService.showMessage('success', 'Confirmé', 'Commande supprimée avec succés.');
      })
    });
  }

  expandAll() {
    this.expandedRows = this.orders().reduce((acc, p) => ((acc as { [key: string | number]: boolean })[p.id!] = true) && acc, {} as { [key: string | number]: boolean })
    console.log(this.expandedRows)
  }

  collapseAll() {
    this.expandedRows = {}
  }

  getStatusSeverity(status: string) {
    switch (status) {
      case 'VALIDATED': return 'success';
      case 'CREATED': return 'info';
      case 'SHIPPED': return 'warn';
      case 'CANCELLED': return 'danger';
      default: return 'secondary';
    }
  }
}
