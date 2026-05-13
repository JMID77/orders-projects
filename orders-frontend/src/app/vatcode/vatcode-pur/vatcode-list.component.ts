// vatcode-list.ts
import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VatCodeService } from '../vatcode-service';
import { VatCode } from '../model/vatcode-model';
import { UserInterPureService } from './user-inter-pure';

@Component({
  selector: 'app-vatcode',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './vatcode-list.component.html'
})
export class VatCodePureList implements OnInit {
  private readonly vatService = inject(VatCodeService);
  private readonly interactionService = inject(UserInterPureService);

  loading = signal(false);
  vatCodes = signal<VatCode[]>([]);
  editingId = signal<number | null>(null);
  
  // Cache pour annulation
  private clonedVat: Record<number, VatCode> = {};

  ngOnInit() { this.loadDatas(); }

  private loadDatas() {
    this.loading.set(true);
    this.vatService.getVatCodes().subscribe(datas => {
      this.vatCodes.set(datas);
      this.loading.set(false);
    });
  }

  addRowAndEdit() {
    if (this.editingId() === -999) return;

    const newVat: VatCode = { id: -999, code: '', description: '', rate: 0, isActive: true };
    this.vatCodes.update(vats => [newVat, ...vats]);
    this.editingId.set(-999);
  }

  onRowEditInit(vat: VatCode) {
    this.clonedVat[vat.id!] = { ...vat };
    this.editingId.set(vat.id!);
  }

  onRowEditCancel(vat: VatCode) {
    if (vat.id === -999) {
      this.vatCodes.update(vats => vats.filter(v => v.id !== -999));
    } else {
      const original = this.clonedVat[vat.id!];
      this.vatCodes.update(vats => vats.map(v => v.id === vat.id ? original : v));
    }
    this.editingId.set(null);
  }

  onRowEditSave(vat: VatCode) {
    const isNew = vat.id === -999;
    const action = isNew ? this.vatService.createVatCode(vat) : this.vatService.updateVatCode(vat.id!, vat);

    action.subscribe({
      next: (res) => {
        this.loadDatas(); // Recharger pour avoir la liste propre et triée
        this.editingId.set(null);
        this.interactionService.showMessage('success', 'Succès', 'Sauvegardé avec succès');
      },
      error: () => this.interactionService.showMessage('error', 'Erreur', 'Échec de la sauvegarde')
    });
  }

  onRowDelete(vat: VatCode) {
    if (this.interactionService.confirm(`Supprimer le code ${vat.code} ?`)) {
      this.vatService.deleteVatCode(vat.id!).subscribe(() => {
        this.vatCodes.update(vats => vats.filter(v => v.id !== vat.id));
        this.interactionService.showMessage('success', 'Supprimé', 'Le code a été retiré');
      });
    }
  }
}
