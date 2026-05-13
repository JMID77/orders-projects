import { Component, input } from '@angular/core'
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CustomerOrder } from '@angular/orders/model/order-model';
import { StatusOption } from '@angular/orders/model/order.status.enum';
import { DatePickerModule } from 'primeng/datepicker';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';

@Component({
  selector: 'app-order-form-header',
  host: { 'class': 'block w-full' },
  imports: [ ReactiveFormsModule, InputTextModule, SelectModule, DatePickerModule ],
  templateUrl: './order-form-header.html',
  styleUrl: './order-form-header.scss',
})
export class OrderFormHeader {
  parentForm = input.required<FormGroup>();
  customers = input<CustomerOrder[]>();
  statuses = input<StatusOption[]>();

  isReadonly = input<boolean>(false);
}
