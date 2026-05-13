import { Component, inject, OnInit, signal } from '@angular/core'
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { VatCodeService } from '../vatcode-service';
import { VatCode } from '../model/vatcode-model';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { CommonModule } from '@angular/common';
import { ToolbarModule } from 'primeng/toolbar';
import { UserInteractionService } from '@angular/core/user-interaction-service';

@Component({
  selector: 'app-vatcode',
  imports: [ToastModule, ConfirmDialogModule, ProgressSpinnerModule, TableModule, InputTextModule, SelectModule, TagModule, FormsModule, ButtonModule, CheckboxModule, CommonModule, ToolbarModule],
  templateUrl: './vatcode-list.html',
  styleUrl: './vatcode-list.scss',
})
export class VatCodeList implements OnInit {
  private readonly vatService = inject(VatCodeService);
  private readonly interactionUserService = inject(UserInteractionService);

  loading = signal(false);

  trackById = (index: number, item: VatCode) => item.id;

  vatCodes = signal<VatCode[]>([]);

  editingRowKeys: { [key: string]: boolean } = {};
  clonedVatCodes: { [s: string]: VatCode } = {};

  ngOnInit(): void {
    this.loadDatas();
  }

  private loadDatas() {
    this.loading.set(true);
    this.vatService.getVatCodes().subscribe((datas) => {
      this.vatCodes.set(datas);
      this.loading.set(false);
    })
  }

  addRowAndEdit() {
    const isNewExists = this.vatCodes().findIndex(v => v.id === -999);

    if (isNewExists === -1) {
      const newVat: VatCode = {
        id: -999,
        code: '',
        description: '',
        rate: 0,
        isActive: true,
      };

      this.vatCodes.update((vats) => [newVat, ...vats]);

      this.editingRowKeys = {
        ...this.editingRowKeys,
        [newVat.id!]: true
      };

      this.clonedVatCodes[newVat.id!] = { ...newVat };

      setTimeout(() => {
        const input = document.querySelector('input');
        (input as HTMLInputElement)?.focus();
      });
    } else {
      this.interactionUserService.showMessage('warn', 'En édition', 'Une ligne est déjà en cours d\'édition.')
    }
  }

  onRowEditInit(vat: VatCode) {
    this.clonedVatCodes[vat.id as number] = { ...vat };
    setTimeout(() => {
      const input = document.querySelector('input');
      (input as HTMLInputElement)?.focus();
    });
  }

  onRowEditSave(vat: VatCode) {
    const isNew = vat.id === -999;

    const { id, ...dtoVat } = vat;

    if (isNew) {
      this.vatService.createVatCode(dtoVat).subscribe({
        next: (created) => {
          const index = this.vatCodes().findIndex(v => v.id === vat.id);
          this.vatCodes.update((vats) => {
            const updatedList = vats.map(v =>
              v.id === -999 ? created : v
            );
            return [...updatedList].sort((a, b) => a.code.localeCompare(b.code));
          });

          this.editingRowKeys = {};
          delete this.clonedVatCodes[vat.id as number];

          this.interactionUserService.showMessage('success', 'Confirmé', 'Code TVA mis à jour avec succés.');
        },
        error: () => {
          this.interactionUserService.showMessage('error', 'Erreur', 'Création du code TVA en erreur.');
        }
      })
    } else {
      const id = vat.id!;
      console.log(dtoVat)
      this.vatService.updateVatCode(id, dtoVat).subscribe({
        next: (updated) => {
          const index = this.vatCodes().findIndex(v => v.id === vat.id);
          this.vatCodes.update((vats) => {
            return vats.map(v =>
              v.id === updated.id ? updated : v
            );
          });

          this.editingRowKeys = {};
          delete this.clonedVatCodes[vat.id as number];

          this.interactionUserService.showMessage('success', 'Confirmé', 'Code TVA mis à jour avec succés.');
        },
        error: () => {
          this.interactionUserService.showMessage('error', 'Erreur', 'Modification du code TVA en erreur.');
        }
      })
    }
  }

  onRowEditCancel(vat: VatCode, index: number) {
    const cloned = this.clonedVatCodes[vat.id as number];

    const isInvalid = (!vat.code || !vat.description || vat.id === -999);
    const isNew = vat.id === -999;

    if (isNew || isInvalid) {
      this.vatCodes.set(this.vatCodes().filter(p => p.id !== vat.id));
    } else {
      this.vatCodes.update((vats) => {
        return vats.map(v => v.id === vat.id ? cloned : v);
      });
    }

    this.editingRowKeys = {};
    delete this.clonedVatCodes[vat.id as number];
  }

  onRowDelete(vat: VatCode, event: Event) {
    const id = vat.id!;

    if (id === undefined) {
      console.warn("Impossible de supprimer le code TVA en base sans ID de code TVA");
      return;
    }

    this.interactionUserService.confirmDeleting(event, () => {
      this.vatService.deleteVatCode(id).subscribe({
        next: () => {
          console.log('Before delete', this.vatCodes())
          this.vatCodes.update((vats) => vats.filter((v) => v.id !== id));
          console.log('After delete', this.vatCodes())
          this.editingRowKeys = {};
          this.clonedVatCodes = {};
          this.interactionUserService.showMessage('success', 'Confirmé', 'Code TVA supprimé avec succés.')
        },
        error: (err) => {
          console.error('Détail de l\'erreur:', err);
          this.interactionUserService.showMessage('error', 'Erreur', 'Impossible de supprimer ce code TVA.')
        }
      })
    });

  }
}
