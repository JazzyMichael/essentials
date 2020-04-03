import { Component } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-color-popover',
  templateUrl: './color-popover.component.html',
  styleUrls: ['./color-popover.component.scss'],
})
export class ColorPopoverComponent {

  colors: any[] = [
    { name: 'Sapphire', icon: 'water', hex: '#2011DF', rgb: '32,17,223', shade: '#1c0fc4', tint: '#3629e2' },
    { name: 'Caramel', icon: 'nutrition', hex: '#804900', rgb: '128, 73, 0', shade: '#714000', tint: '#8D5B1A' },
    { name: 'Ruby', icon: 'rose', hex: '#9A2066', rgb: '154,32,102', shade: '#881c5a', tint: '#a43675' },
    { name: 'Tiger', icon: 'bonfire', hex: '#C5803A', rgb: '197,128,58', shade: '#ad7133', tint: '#cb8d4e' },
    { name: 'Emerald', icon: 'leaf', hex: '#629404', rgb: '98,148,4', shade: '#568204', tint: '#729f1d' },
    { name: 'Raisin', icon: 'egg', hex: '#60349F', rgb: '96,52,159', shade: '#542e8c', tint: '#7048a9' }
  ];

  constructor(private popover: PopoverController) { }

  async select({ hex, rgb, shade, tint }) {
    document.documentElement.style.setProperty('--ion-color-primary', hex);
    document.documentElement.style.setProperty('--ion-color-primary-rgb', rgb);
    document.documentElement.style.setProperty('--ion-color-primary-shade', shade);
    document.documentElement.style.setProperty('--ion-color-primary-tint', tint);

    await this.popover.dismiss();
  }

}
