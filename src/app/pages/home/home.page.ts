import { Component, OnInit } from '@angular/core';
import { NavController, ToastController, AlertController } from '@ionic/angular';
import { TasksService } from '../../core/services/tasks.service';
import { CategoriesService } from '../../core/services/categories.service';
import { FeatureFlagsService } from '../../core/services/feature-flags.service';
import { Task } from '../../core/models/task.model';
import { Category } from '../../core/models/category.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  standalone: false,
})
export class HomePage implements OnInit {
  tasks: Task[] = [];
  categories: Category[] = [];
  loading = true;

  /** filtro actual (vacío = todas) */
  selectedCategoryId = '';

  /** controlado por Remote Config */
  showCategories = true;

  constructor(
    private readonly tasksSvc: TasksService,
    private readonly catSvc: CategoriesService,
    private readonly nav: NavController,
    private readonly toast: ToastController,
    private readonly alert: AlertController,
    private readonly ff: FeatureFlagsService,

  ) { }

  async ngOnInit() {
    this.showCategories = await this.ff.getEnableCategories();
    await this.load();
  }

  async ionViewWillEnter() {
    await this.load();
    this.showCategories = await this.ff.getEnableCategories();
  }

  /** Carga categorías (si flag activo) y tareas */
  async load() {
    this.loading = true;
    try {
      if (this.showCategories) {
        this.categories = await this.catSvc.list();
      } else {
        this.categories = [];
        this.selectedCategoryId = '';
      }
      this.tasks = await this.tasksSvc.list();
    } finally {
      this.loading = false;
    }
  }

  /** Navega a crear tarea */
  goAdd() {
    this.nav.navigateForward(['/add-task']);
  }

  /** Navega a editar tarea */
  edit(t: Task) {
    this.nav.navigateForward(['/edit-task', t.id]);
  }

  /** Marca/Desmarca y recarga */
  async toggle(t: Task) {
    await this.tasksSvc.toggle(t.id);
    await this.load();
  }

  /** Eliminar con confirmación */
  async delete(t: Task) {
    const confirm = await this.alert.create({
      header: 'Eliminar tarea',
      message: `¿Seguro que deseas eliminar "${t.title}"?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          handler: async () => {
            await this.tasksSvc.remove(t.id);
            (await this.toast.create({ message: 'Tarea eliminada', duration: 1200 })).present();
            await this.load();
          },
        },
      ],
    });
    await confirm.present();
  }

  /** Nombre de la categoría para mostrar en lista */
  getCategoryName(id?: string): string {
    if (!id) return 'Sin categoría';
    return this.categories.find(c => c.id === id)?.name ?? 'Sin categoría';
  }

  async doRefresh(event: any) {
    try {
      await this.load();
    } finally {
      event?.target?.complete();
    }
  }

  async refreshRC() {
    this.showCategories = await this.ff.getEnableCategories(true);
    const msg = `RC actualizado. enable_categories=${this.showCategories}`;
    (await this.toast.create({ message: msg, duration: 1800 })).present();
  }
}
