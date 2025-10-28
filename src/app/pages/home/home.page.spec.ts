import { TestBed } from '@angular/core/testing';
import { IonicModule, NavController } from '@ionic/angular';
import { HomePage } from './home.page';
import { TasksService } from '../../core/services/tasks.service';
import { CategoriesService } from '../../core/services/categories.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MockFeatureFlagsService } from '../../../testing/mock-feature-flags.service';
import { FeatureFlagsService } from '../../core/services/feature-flags.service';

class MockTasksService {
  private tasks = [
    { id: 't1', title: 'A', status: 'pending', createdAt: 1, updatedAt: 1, categoryId: 'c1' },
    { id: 't2', title: 'B', status: 'done', createdAt: 1, updatedAt: 1 },
  ];
  list = jest.fn().mockResolvedValue(this.tasks);
  remove = jest.fn().mockResolvedValue(undefined);
  toggle = jest.fn().mockResolvedValue(undefined);
}
class MockCategoriesService {
  list = jest.fn().mockResolvedValue([
    { id: 'c1', name: 'Trabajo' },
    { id: 'c2', name: 'Casa' }
  ]);
}
class MockNavController {
  navigateForward = jest.fn();
}

describe('HomePage', () => {
  let component: HomePage;
  let tasksSvc: MockTasksService;
  let catSvc: MockCategoriesService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IonicModule.forRoot()],
      declarations: [HomePage],
      providers: [
        { provide: TasksService, useClass: MockTasksService },
        { provide: CategoriesService, useClass: MockCategoriesService },
        { provide: NavController, useClass: MockNavController },
        { provide: FeatureFlagsService, useClass: MockFeatureFlagsService },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    const fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    tasksSvc = TestBed.inject(TasksService) as any;
    catSvc = TestBed.inject(CategoriesService) as any;
  });

  it('load obtiene categorías y tareas', async () => {
    await component.ngOnInit();
    await component.ionViewWillEnter();
    expect(catSvc.list).toHaveBeenCalled();
    expect(tasksSvc.list).toHaveBeenCalled();
    expect(component.tasks.length).toBe(2);
  });

  it('getCategoryName devuelve nombre o "Sin categoría"', async () => {
    await component.ngOnInit();
    await component.ionViewWillEnter();
    expect(component.getCategoryName('c1')).toBe('Trabajo');
    expect(component.getCategoryName('zzz')).toBe('Sin categoría');
  });

  it('toggle llama service y recarga', async () => {
    await component.ngOnInit();
    await component.ionViewWillEnter();
    await component.toggle(component.tasks[0] as any);
    expect(tasksSvc.toggle).toHaveBeenCalledWith('t1');
    expect(tasksSvc.list).toHaveBeenCalledTimes(3);
  });

  it('delete llama remove y recarga', async () => {
    await component.ngOnInit();
    await component.ionViewWillEnter();
    await component.delete(component.tasks[0] as any);
    expect(tasksSvc.list).toHaveBeenCalledTimes(2);
  });
});
