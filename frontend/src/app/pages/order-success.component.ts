import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RedirectLoaderComponent } from '../components/redirect-loader.component';

@Component({
  selector: 'app-order-success',
  standalone: true,
  imports: [CommonModule, RedirectLoaderComponent],
  template: `
    <app-redirect-loader 
      [seconds]="3" 
      [redirectUrl]="'/orders'" 
      [message]="'Order Successfully. Please Wait...'">
    </app-redirect-loader>
  `
})
export class OrderSuccessComponent {}
