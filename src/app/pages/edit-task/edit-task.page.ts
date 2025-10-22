import { Component, OnInit } from '@angular/core';
import { AlertController, IonicModule, NavController, ToastController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { TasksService } from 'src/app/core/services/tasks.service';
import { Task } from 'src/app/core/models/task.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoriesService } from 'src/app/core/services/categories.service';
import { Category } from 'src/app/core/models/category.model';

@Component({
  selector: 'app-edit-task',
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
  templateUrl: './edit-task.page.html',
})
export class EditTaskPage implements OnInit {
  task?: Task;
  title = '';
  description = '';
  categoryId = '';
  categories: Category[] = [];
  isDone = false;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly tasksSvc: TasksService,
    private readonly catSvc: CategoriesService,
    private readonly nav: NavController,
    private readonly toast: ToastController,
    private readonly alert: AlertController
  ) { }
  async ngOnInit() {
    await this.loadCategories();
    await this.loadTask();
  }

  async ionViewWillEnter() {
    await this.loadCategories();
  }

  private async loadTask() {
    const id = this.route.snapshot.paramMap.get('id')!;
    const t = await this.tasksSvc.get(id);
    if (!t) return;
    this.task = t;
    this.title = t.title;
    this.description = t.description ?? '';
    this.categoryId = t.categoryId ?? '';
    this.isDone = t.status === 'done';
  }

  private async loadCategories() {
    this.categories = await this.catSvc.list();
  }

  async save() {
    if (!this.task) return;
    const updated: Task = {
      ...this.task,
      title: this.title.trim(),
      description: this.description?.trim(),
      categoryId: this.categoryId || undefined,
      status: this.isDone ? 'done' : 'pending',
      updatedAt: Date.now(),
    };

    if (!updated.title) {
      (await this.toast.create({ message: 'El título es obligatorio', duration: 1500 })).present();
      return;
    }

    await this.tasksSvc.update(updated);
    (await this.toast.create({ message: 'Cambios guardados', duration: 1200 })).present();
    this.nav.back();
  }

  async toggleStatus(_: any) {
    this.isDone = !this.isDone;
  }

  async deleteTask() {
    if (!this.task) return;
    const alert = await this.alert.create({
      header: 'Eliminar tarea',
      message: `¿Seguro que deseas eliminar "${this.task.title}"?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          handler: async () => {
            await this.tasksSvc.remove(this.task!.id);
            (await this.toast.create({ message: 'Tarea eliminada', duration: 1200 })).present();
            this.nav.navigateBack('/home');
          },
        },
      ],
    });
    await alert.present();
  }

  async toggleAndSave(ev: CustomEvent) {
    this.isDone = !!ev.detail.checked;
    const updated: Task = {
      ...this.task!,
      title: this.title.trim(),
      description: this.description?.trim(),
      status: this.isDone ? 'done' : 'pending',
      updatedAt: Date.now(),
    };
    await this.tasksSvc.update(updated);
    this.task = updated;
    (await this.toast.create({ message: 'Estado actualizado', duration: 1200 })).present();
  }
}
