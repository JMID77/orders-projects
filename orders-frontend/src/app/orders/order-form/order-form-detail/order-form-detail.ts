import { CurrencyPipe } from '@angular/common'
import { Component, computed, effect, EventEmitter, input, Input, output, Output, signal } from '@angular/core'
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { ProductOrder } from '@angular/orders/model/order-model'
import { VatCode } from '@angular/vatcode/model/vatcode-model'
import { ButtonModule } from 'primeng/button'
import { InputNumberModule } from 'primeng/inputnumber'
import { SelectModule } from 'primeng/select'
import { TableModule } from 'primeng/table'

@Component({
  selector: 'app-order-form-detail',
  imports: [
    ReactiveFormsModule,
    TableModule,
    ButtonModule,
    SelectModule,
    InputNumberModule,
    CurrencyPipe,
  ],
  templateUrl: './order-form-detail.html',
  styleUrl: './order-form-detail.scss',
})
export class OrderFormDetail {
  parentForm = input.required<FormGroup>();
  products = input<ProductOrder[]>();
  vatCodes = input<VatCode[]>();
  lineDeleted = output<{ id: number; event: Event }>();

  isReadonly = input<boolean>(false);

  private orderLinesSignal = signal<any[]>([])

  totalOrderHTVA = computed(() => {
    return this.orderLinesSignal().reduce((acc, line) => {
      return acc + (line.quantity || 0) * (line.price || 0)
    }, 0)
  })

  totalOrderTVAC = computed(() => {
    return this.orderLinesSignal().reduce((acc, line) => {
      let total = 0;
      const vatId = line.vat_rate ?? 0;
      console.log(vatId)
      if (vatId !== 0) {
        const vatRate = this.vatCodes()?.find(v => v.id === vatId)?.rate ?? -99;
        console.log(vatRate)
        if (vatRate !== 99) {
          total = (line.quantity || 0) * (line.price || 0) * (1 + vatRate / 100);
          console.log(total)
        }
      }

      return acc + total;
    }, 0)
  })

  constructor() {
    effect((onCleanup) => { // On utilise onCleanup, c'est plus propre pour les signals
    const control = this.parentForm().get('orderLines');
    
    if (control) {
      this.orderLinesSignal.set(control.value);

      const sub = control.valueChanges.subscribe(val => {
        this.orderLinesSignal.set(val);
      });

      // On enregistre le nettoyage
      onCleanup(() => sub.unsubscribe());
    }
  });
  }
  
  get orderLines(): FormArray<FormGroup> {
    return this.parentForm().get('orderLines') as FormArray<FormGroup>
  }

  addLine() {
    const controlId = new FormControl<number | null>(null);
    const productControl = new FormControl<number | null>(null, Validators.required);
    const quantityControl = new FormControl(1, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(1)],
    });
    const priceControl = new FormControl(0, {
      nonNullable: true,
      validators: [Validators.required],
    });
    const vatRateControl = new FormControl(null, Validators.required);

    productControl.valueChanges.subscribe((id) => {
      if (id) {
        const selectedProduct = this.products()?.find((p) => p.id === id)
        if (selectedProduct) {
          priceControl.setValue(selectedProduct.price, { emitEvent: false })
        }
      }
    });

    this.orderLines.push(
      new FormGroup({
        id: controlId,
        productId: productControl,
        quantity: quantityControl,
        price: priceControl,
        vat_rate: vatRateControl,
      }),
    );
  }

  removeLine(index: number, event: Event) {
    const lineDel = this.orderLines.at(index);
    const lineId = lineDel?.get('id')?.value;
    if (lineId) {
      this.lineDeleted.emit({id: lineId, event: event});
    } else {
      this.orderLines.removeAt(index);
    }
  }

  computeTotal(line: FormGroup, withVAT: boolean= false): number {
    let total = 0;
    const quantity = line.get('quantity')?.value ?? 0;
    const price = line.get('price')?.value ?? 0;

    total = (quantity * price)
    
    if (withVAT) {
      const vatId = line.get('vat_rate')?.value ?? -1;
      const vatRate = this.vatCodes()?.find(v => v.id === vatId)?.rate ?? -99;

      if (vatRate !== -99) {
        total = (total * (1 + vatRate / 100));
      }
    }

    return total;
  }
}
