import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Task } from '../models/task.model';

const STORAGE_KEY = 'tasks';

@Injectable({ providedIn: 'root' })
export class TasksService {
    private _ready = this.storage.create();

    constructor(private storage: Storage) { }

    private async loadAll(): Promise<Task[]> {
        await this._ready;
        return (await this.storage.get(STORAGE_KEY)) ?? [];
    }

    private async saveAll(tasks: Task[]): Promise<void> {
        await this._ready;
        await this.storage.set(STORAGE_KEY, tasks);
    }

    async list(): Promise<Task[]> {
        return this.loadAll();
    }

    async get(id: string): Promise<Task | undefined> {
        const all = await this.loadAll();
        return all.find(t => t.id === id);
    }

    async create(task: Task): Promise<void> {
        const all = await this.loadAll();
        all.push(task);
        await this.saveAll(all);
    }

    async update(task: Task): Promise<void> {
        const all = await this.loadAll();
        const idx = all.findIndex(t => t.id === task.id);
        if (idx >= 0) {
            all[idx] = { ...task };
            await this.saveAll(all);
        }
    }

    async remove(id: string): Promise<void> {
        const all = await this.loadAll();
        await this.saveAll(all.filter(t => t.id !== id));
    }

    async toggle(id: string): Promise<void> {
        const all = await this.loadAll();
        const idx = all.findIndex(t => t.id === id);
        if (idx >= 0) {
            const cur = all[idx];
            all[idx] = {
                ...cur,
                status: cur.status === 'done' ? 'pending' : 'done',
                updatedAt: Date.now()
            };
            await this.saveAll(all);
        }
    }
}
