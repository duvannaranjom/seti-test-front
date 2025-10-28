import { TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavController, ToastController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { EditTaskPage } from './edit-task.page';
import { CategoriesService } from '../../core/services/categories.service';
import { TasksService } from '../../core/services/tasks.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FeatureFlagsService } from '../../core/services/feature-flags.service';
import { MockFeatureFlagsService } from '../../../testing/mock-feature-flags.service';

class MockTasksService {
  get = jest.fn().mockResolvedValue({
    id: 't1',
    title: 'Original',
    description: 'Desc',
    status: 'pending',
    createdAt: 1, updatedAt: 1
  });
  update = jest.fn().mockResolvedValue(undefined);
}
class MockCategoriesService {
  list = jest.fn().mockResolvedValue([{ id: 'c1', name: 'Trabajo' }]);
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
class MockActivatedRoute {
  snapshot = { paramMap: new Map([['id', 't1']]) };
}

describe('EditTaskPage', () => {
  let component: EditTaskPage;
  let tasksSvc: MockTasksService;
  let toastCtrl: MockToastController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IonicModule.forRoot(), FormsModule],
      declarations: [EditTaskPage],
      providers: [
    { provide: TasksService, useClass: MockTasksService },
    { provide: CategoriesService, useClass: MockCategoriesService },
    { provide: ToastController, useClass: MockToastController },
    { provide: NavController, useClass: MockNavController },
    { provide: ActivatedRoute, useClass: MockActivatedRoute },
    { provide: FeatureFlagsService, useClass: MockFeatureFlagsService }, // 👈
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    const fixture = TestBed.createComponent(EditTaskPage);
    component = fixture.componentInstance;
    tasksSvc = TestBed.inject(TasksService) as any;
    toastCtrl = TestBed.inject(ToastController) as any;
  });

  it('carga tarea en ngOnInit', async () => {
    await component.ngOnInit();
    expect(tasksSvc.get).toHaveBeenCalledWith('t1');
    expect(component.title).toBe('Original');
    expect(component.description).toBe('Desc');
    expect(component.isDone).toBe(false);
  });

  it('save actualiza la tarea con el estado actual', async () => {
    await component.ngOnInit();
    component.title = 'Editada';
    component.isDone = true;
    await component.save();
    expect(tasksSvc.update).toHaveBeenCalled();
    const payload = (tasksSvc.update as jest.Mock).mock.calls[0][0];
    expect(payload.status).toBe('done');
    expect(payload.title).toBe('Editada');
    expect(toastCtrl.create).toHaveBeenCalled();
  });

  it('toggleAndSave cambia status y persiste de inmediato', async () => {
    await component.ngOnInit();
    const ev: any = { detail: { checked: true } };
    await component.toggleAndSave(ev);
    expect(tasksSvc.update).toHaveBeenCalled();
    const payload = (tasksSvc.update as jest.Mock).mock.calls.pop()[0];
    expect(payload.status).toBe('done');
  });
});
