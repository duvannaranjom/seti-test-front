import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './app-header.component.html',
  standalone: false,
})
export class AppHeaderComponent {
  @Input() title = '';
  @Input() back = false;
  @Input() backHref = '/home';
}
