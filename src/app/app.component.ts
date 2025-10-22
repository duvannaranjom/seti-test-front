import { Component, OnInit } from '@angular/core';
import { FeatureFlagsService } from './core/services/feature-flags.service';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: false

})
export class AppComponent implements OnInit {
  showCategories = true;

  constructor(private readonly ff: FeatureFlagsService, private readonly platform: Platform) {}

  async ngOnInit() {
    this.showCategories = await this.ff.getEnableCategories(true);

    document.addEventListener('visibilitychange', async () => {
      if (document.visibilityState === 'visible') {
        this.showCategories = await this.ff.getEnableCategories(true);
      }
    });

    this.platform.resume.subscribe(async () => {
      this.showCategories = await this.ff.getEnableCategories(true);
    });
  }
}
