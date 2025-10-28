import { TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { FeatureFlagsService } from './core/services/feature-flags.service';
import { MockFeatureFlagsService } from '../testing/mock-feature-flags.service';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: any;
  let ff: MockFeatureFlagsService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [
        IonicModule.forRoot(),
        RouterTestingModule  // 👈 esto provee ActivatedRoute, RouterOutlet, etc.
      ],
      providers: [
        { provide: FeatureFlagsService, useClass: MockFeatureFlagsService }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    ff = TestBed.inject(FeatureFlagsService) as any;
  });

  it('debe crearse', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit: carga showCategories desde FeatureFlagsService', async () => {
    (ff.getEnableCategories as jest.Mock).mockResolvedValueOnce(true);
    await component.ngOnInit();
    expect(ff.getEnableCategories).toHaveBeenCalledWith(true);
    expect(component.showCategories).toBe(true);
  });

  it('visibilidad: al volver a visible refresca el flag', async () => {
    await component.ngOnInit();

    (ff.getEnableCategories as jest.Mock).mockResolvedValueOnce(false);

    Object.defineProperty(document, 'visibilityState', { value: 'visible', configurable: true });
    document.dispatchEvent(new Event('visibilitychange'));
    await Promise.resolve();

    expect(ff.getEnableCategories).toHaveBeenCalledTimes(2);
    expect(component.showCategories).toBe(false);
  });
});
