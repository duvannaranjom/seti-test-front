import { TasksService } from './tasks.service';
import { Storage } from '@ionic/storage-angular';
import { Task } from '../models/task.model';
import { MockStorage } from '../../../testing/mock-storage';

describe('TasksService', () => {
    let service: TasksService;
    let storage: MockStorage;

    const KEY = 'tasks';

    beforeEach(async () => {
        storage = new MockStorage();
        await storage.create();
        service = new TasksService(storage as unknown as Storage);
    });

    it('debe iniciar lista vacía', async () => {
        const list = await service.list();
        expect(list).toEqual([]);
    });

    it('debe crear y listar tareas', async () => {
        const now = Date.now();
        const t: Task = {
            id: '1',
            title: 'Primera',
            status: 'pending',
            createdAt: now, updatedAt: now
        };
        await service.create(t);
        const list = await service.list();
        expect(list.length).toBe(1);
        expect(list[0].title).toBe('Primera');
    });

    it('debe obtener por id', async () => {
        const now = Date.now();
        await service.create({ id: 'A', title: 'T1', status: 'pending', createdAt: now, updatedAt: now });
        const found = await service.get('A');
        expect(found?.title).toBe('T1');
    });

    it('debe actualizar tarea existente', async () => {
        const now = Date.now();
        await service.create({ id: 'A', title: 'T1', status: 'pending', createdAt: now, updatedAt: now });
        const updated: Task = { id: 'A', title: 'Nuevo', status: 'done', createdAt: now, updatedAt: now + 1 };
        await service.update(updated);

        const list = await service.list();
        expect(list[0].title).toBe('Nuevo');
        expect(list[0].status).toBe('done');
    });

    it('debe eliminar por id', async () => {
        const now = Date.now();
        await service.create({ id: 'A', title: 'T1', status: 'pending', createdAt: now, updatedAt: now });
        await service.create({ id: 'B', title: 'T2', status: 'pending', createdAt: now, updatedAt: now });

        await service.remove('A');
        const list = await service.list();
        expect(list.map(t => t.id)).toEqual(['B']);
    });

    it('debe alternar estado (toggle)', async () => {
        const now = Date.now();
        await service.create({ id: 'A', title: 'T1', status: 'pending', createdAt: now, updatedAt: now });
        await service.toggle('A');
        let list = await service.list();
        expect(list[0].status).toBe('done');

        await service.toggle('A');
        list = await service.list();
        expect(list[0].status).toBe('pending');
    });
});
