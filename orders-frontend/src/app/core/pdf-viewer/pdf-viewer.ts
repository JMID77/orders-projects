import { Component, inject, signal } from '@angular/core'
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { EnumTypePdf, PdfApiService } from '../pdf-api.-service';
import { DrawerModule } from 'primeng/drawer';

@Component({
  selector: 'app-pdf-drawer-viewer',
  standalone: true,
  imports: [ DrawerModule ],
  templateUrl: './pdf-viewer.html',
  styleUrl: './pdf-viewer.scss',
})
export class PdfViewer {
  private readonly pdfService = inject(PdfApiService);
  private readonly sanitizer = inject(DomSanitizer);

  visible = signal(false);
  printing = signal(false);

  pdfUrl!: SafeResourceUrl | null;
  private objectUrl: string | null= null;

  openPdf(orderId: number, type: EnumTypePdf) {
    this.visible.set(true);
    this.printing.set(true);

    this.pdfService.generatorPdf(orderId, type).subscribe(blob => {
      if (this.objectUrl) {
        URL.revokeObjectURL(this.objectUrl);
        this.objectUrl = null;
      }

      this.objectUrl = URL.createObjectURL(blob);

      this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.objectUrl);
      
      this.printing.set(false);
    });

  }

  close() {
    this.visible.set(false);

    if (this.objectUrl) {
      URL.revokeObjectURL(this.objectUrl);
      this.objectUrl = null;
    }

    this.pdfUrl = null;
  }

}
