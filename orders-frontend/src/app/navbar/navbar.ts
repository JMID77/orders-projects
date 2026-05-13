import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { AuthService } from '@angular/auth/auth-service';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, MenubarModule, RouterModule, RouterLink, NgOptimizedImage, ButtonModule],
  templateUrl: './navbar.html'
})
export class Navbar {
  authService = inject(AuthService);
  router: Router = inject(Router);

  loggingOut = signal<boolean>(false);


  items = computed<MenuItem[]>(() => {
    if (!this.authService.isLoggedIn()) return [];

    const isAdmin = this.authService.isAdmin();

    return [
      { label: 'Dashboard', icon: 'pi pi-chart-bar', routerLink: '/dashboard' },
      {
        label: 'Commandes',
        icon: 'pi pi-shopping-cart',
        items: [
          { label: 'Liste', icon: 'pi pi-list', routerLink: '/orders' },
          { label: 'Créer', icon: 'pi pi-plus', routerLink: '/orders/create' }
        ]
      },
      {
        label: 'Clients',
        icon: 'pi pi-address-book',
        items: [
          { label: 'Liste', icon: 'pi pi-list', routerLink: '/customers' },
          { label: 'Créer', icon: 'pi pi-plus', routerLink: '/customers/create' }
        ]
      },
      {
        label: 'Produits',
        icon: 'pi pi-box',
        items: [
          { label: 'Liste', icon: 'pi pi-list', routerLink: '/products' },
          { label: 'Créer', icon: 'pi pi-plus', routerLink: '/products/create' }
        ]
      },
      {
        label: 'Configurations',
        icon: 'pi pi-cog',
        visible: isAdmin,
        items: [
          { label: 'Utilisateurs', icon: 'pi pi-user-plus', routerLink: '/users' },
          { label: 'Codes TVA', icon: 'pi pi-money-bill', routerLink: '/vat' },
          // { label: 'Codes TVA (Pure)', icon: 'pi pi-money-bill', routerLink: '/vat-pure' }
        ]
      }
    ];
  });

  logout(): void {
    this.loggingOut.set(true);
    this.authService.logout();

    this.router.navigateByUrl('/login', { replaceUrl: true })
      .finally(() => {
        this.loggingOut.set(false);
      });
  }
}