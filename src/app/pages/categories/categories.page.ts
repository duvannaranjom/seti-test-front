import { Component, OnInit } from '@angular/core';
import { CategoriesService } from '../../core/services/categories.service';
import { Category } from '../../core/models/category.model';
import { v4 as uuid } from 'uuid';
import { AlertController, ToastController } from '@ionic/angular';
@Component({
  selector: 'app-categories',
  standalone: false,
  templateUrl: './categories.page.html',
})
export class CategoriesPage implements OnInit {
  categories: Category[] = [];
  name = '';
  color = '';

  constructor(
    private readonly catSvc: CategoriesService,
    private readonly alert: AlertController,
    private readonly toast: ToastController
  ) { }

  async ngOnInit() {
    await this.load();
  }

  async ionViewWillEnter() {
    await this.load();
  }

  async load() {
    this.categories = await this.catSvc.list();
  }

  async add() {
    if (!this.name.trim()) {
      (await this.toast.create({ message: 'Nombre requerido', duration: 1500 })).present();
      return;
    }

    const cat: Category = {
      id: uuid(),
      name: this.name.trim(),
      color: this.color || '#4CAF50',
    };

    await this.catSvc.create(cat);
    this.name = '';
    this.color = '';
    await this.load();
  }

  async delete(cat: Category) {
    const alert = await this.alert.create({
      header: 'Confirmar',
      message: `¿Eliminar categoría "${cat.name}"?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar', handler: async () => {
            await this.catSvc.remove(cat.id);
            await this.load();
          }
        }
      ]
    });
    await alert.present();
  }
}
