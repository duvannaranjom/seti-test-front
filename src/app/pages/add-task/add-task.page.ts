import { Component, OnInit } from '@angular/core';
import { IonicModule, NavController, ToastController } from '@ionic/angular';
import { v4 as uuid } from 'uuid';
import { TasksService } from 'src/app/core/services/tasks.service';
import { Task } from 'src/app/core/models/task.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Category } from 'src/app/core/models/category.model';
import { CategoriesService } from 'src/app/core/services/categories.service';
import { SharedModule } from 'src/app/shared/shared-module';
import { FeatureFlagsService } from 'src/app/core/services/feature-flags.service';

@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, SharedModule],
  templateUrl: './add-task.page.html',
})
export class AddTaskPage implements OnInit {
  categories: Category[] = [];
  categoryId = '';
  title = '';
  description = '';
  enableCategories = false;


  constructor(
    private readonly tasksSvc: TasksService,
    private readonly catSvc: CategoriesService,
    private readonly nav: NavController,
    private readonly toast: ToastController,
    private readonly ff: FeatureFlagsService
  ) {

  }

  async ngOnInit() {
    this.loadCategories();
    this.enableCategories = await this.ff.getEnableCategories();

  }

  async ionViewWillEnter() {
    await this.loadCategories();
    this.enableCategories = await this.ff.getEnableCategories();
  }

  async save() {
    const now = Date.now();
    const task: Task = {
      id: uuid(),
      title: this.title.trim(),
      description: this.description?.trim(),
      categoryId: this.categoryId,
      status: 'pending',
      createdAt: now,
      updatedAt: now,
    };

    if (!task.title) {
      (await this.toast.create({ message: 'El título es obligatorio', duration: 1500 })).present();
      return;
    }

    await this.tasksSvc.create(task);
    (await this.toast.create({ message: 'Tarea creada', duration: 1200 })).present();
    this.nav.back();
  }

  async loadCategories() {
    this.categories = await this.catSvc.list();
  }
}
