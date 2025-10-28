import { TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavController, ToastController } from '@ionic/angular';
import { AddTaskPage } from './add-task.page';
import { TasksService } from '../../core/services/tasks.service';
import { CategoriesService } from '../../core/services/categories.service';
import { of } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FeatureFlagsService } from '../../core/services/feature-flags.service';
import { MockFeatureFlagsService } from '../../../testing/mock-feature-flags.service';

class MockTasksService {
  create = jest.fn().mockResolvedValue(undefined);
}
class MockCategoriesService {
  list = jest.fn().mockResolvedValue([
    { id: 'cat-1', name: 'Trabajo' },
    { id: 'cat-2', name: 'Casa' },
  ]);
}
class MockToast {
  present = jest.fn();
}
class MockToastController {
  create = jest.fn().mockResolvedValue(new MockToast());
}
class MockNavController {
  back = jest.fn();
}

describe('AddTaskPage', () => {
  let component: AddTaskPage;
  let tasksSvc: MockTasksService;
  let catSvc: MockCategoriesService;
  let toastCtrl: MockToastController;
  let nav: MockNavController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddTaskPage],
      imports: [IonicModule.forRoot(), FormsModule],
      providers: [
        { provide: TasksService, useClass: MockTasksService },
        { provide: CategoriesService, useClass: MockCategoriesService },
        { provide: ToastController, useClass: MockToastController },
        { provide: NavController, useClass: MockNavController },
        { provide: FeatureFlagsService, useClass: MockFeatureFlagsService },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    const fixture = TestBed.createComponent(AddTaskPage);
    component = fixture.componentInstance;
    tasksSvc = TestBed.inject(TasksService) as any;
    catSvc = TestBed.inject(CategoriesService) as any;
    toastCtrl = TestBed.inject(ToastController) as any;
    nav = TestBed.inject(NavController) as any;
  });

  it('carga categorías en ngOnInit', async () => {
    await component.ngOnInit();
    expect(catSvc.list).toHaveBeenCalled();
    expect(component.categories.length).toBe(2);
  });

  it('no guarda si el título está vacío y muestra toast', async () => {
    await component.ngOnInit();
    component.title = '   ';
    await component.save();
    expect(tasksSvc.create).not.toHaveBeenCalled();
    expect(toastCtrl.create).toHaveBeenCalled();
  });

  it('guarda tarea válida y navega atrás', async () => {
    await component.ngOnInit();
    component.title = 'Tarea X';
    component.description = 'Detalle';
    component.categoryId = 'cat-1';

    await component.save();

    expect(tasksSvc.create).toHaveBeenCalled();
    expect(toastCtrl.create).toHaveBeenCalled();
    expect(nav.back).toHaveBeenCalled();
  });
});
