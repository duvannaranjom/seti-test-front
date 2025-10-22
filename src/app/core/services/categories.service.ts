import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Category } from '../models/category.model';

const STORAGE_KEY = 'categories';

@Injectable({ providedIn: 'root' })
export class CategoriesService {
    private _ready = this.storage.create();
    async ready() { await this._ready; }

    constructor(private storage: Storage) { }

    private async loadAll(): Promise<Category[]> {
        await this._ready;
        return (await this.storage.get(STORAGE_KEY)) ?? [];
    }

    private async saveAll(cats: Category[]): Promise<void> {
        await this._ready;
        await this.storage.set(STORAGE_KEY, cats);
    }

    async list(): Promise<Category[]> {
        await this.ready();
        return (await this.storage.get(STORAGE_KEY)) ?? [];
    }

    async create(cat: Category): Promise<void> {
        const all = await this.loadAll();
        all.push(cat);
        await this.saveAll(all);
    }

    async remove(id: string): Promise<void> {
        const all = await this.loadAll();
        await this.saveAll(all.filter(c => c.id !== id));
    }

    async get(id: string): Promise<Category | undefined> {
        const all = await this.loadAll();
        return all.find(c => c.id === id);
    }
}
