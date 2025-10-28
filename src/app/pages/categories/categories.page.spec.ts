import { TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { IonicModule, AlertController, ToastController } from '@ionic/angular';
import { CategoriesPage } from './categories.page';
import { CategoriesService } from '../../core/services/categories.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FeatureFlagsService } from '../../core/services/feature-flags.service';
import { MockFeatureFlagsService } from '../../../testing/mock-feature-flags.service';

class MockCategoriesService {
  private data = [
    { id: 'c1', name: 'Trabajo', color: '#00AAFF' },
    { id: 'c2', name: 'Casa', color: '#FF9900' },
  ];
  list = jest.fn().mockResolvedValue(this.data);
  create = jest.fn().mockImplementation(async (c) => this.data.push(c));
  remove = jest.fn().mockImplementation(async (id) => {
    this.data = this.data.filter(x => x.id !== id);
  });
}
class MockToast {
  present = jest.fn();
}
class MockToastController {
  create = jest.fn().mockResolvedValue(new MockToast());
}
class MockAlert {
  constructor(private buttons: any[]) { }
  present = jest.fn();
  // método auxiliar para testear confirmación
  __confirm() {
    const btn = this.buttons.find(b => !b.role && b.handler);
    btn && btn.handler();
  }
}
class MockAlertController {
  lastAlert: MockAlert | null = null;
  create = jest.fn().mockImplementation(async (opts) => {
    this.lastAlert = new MockAlert(opts.buttons || []);
    return this.lastAlert;
  });
}

describe('CategoriesPage', () => {
  let component: CategoriesPage;
  let catSvc: MockCategoriesService;
  let toastCtrl: MockToastController;
  let alertCtrl: MockAlertController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CategoriesPage],
      imports: [IonicModule.forRoot(), FormsModule],
      providers: [
        { provide: CategoriesService, useClass: MockCategoriesService },
        { provide: ToastController, useClass: MockToastController },
        { provide: AlertController, useClass: MockAlertController },
        { provide: FeatureFlagsService, useClass: MockFeatureFlagsService },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    const fixture = TestBed.createComponent(CategoriesPage);
    component = fixture.componentInstance;

    catSvc = TestBed.inject(CategoriesService) as any;
    toastCtrl = TestBed.inject(ToastController) as any;
    alertCtrl = TestBed.inject(AlertController) as any;
  });

  it('lista categorías en ngOnInit/ionViewWillEnter', async () => {
    await component.ngOnInit();
    expect(catSvc.list).toHaveBeenCalled();
    expect(component.categories.length).toBeGreaterThan(0);

    await component.ionViewWillEnter();
    expect(catSvc.list).toHaveBeenCalledTimes(2);
  });

  it('evita crear sin nombre y muestra toast', async () => {
    component.name = '   ';
    await component.add();
    expect(catSvc.create).not.toHaveBeenCalled();
    expect(toastCtrl.create).toHaveBeenCalled();
  });

  it('crea categoría válida', async () => {
    component.name = 'Nueva';
    component.color = '#123456';
    await component.add();
    expect(catSvc.create).toHaveBeenCalled();
    expect(component.categories.find(c => c.name === 'Nueva')).toBeTruthy();
  });

  it('elimina categoría al confirmar en el alert', async () => {
    await component.ngOnInit();
    const target = component.categories[0];
    await component.delete(target);
    // simula confirmar:
    (alertCtrl as any).lastAlert.__confirm();
    // después de handler, service.remove se invoca
    expect(catSvc.remove).toHaveBeenCalledWith(target.id);
  });
});
