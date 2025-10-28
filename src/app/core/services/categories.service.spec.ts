import { CategoriesService } from './categories.service';
import { Storage } from '@ionic/storage-angular';
import { Category } from '../models/category.model';
import { MockStorage } from '../../../testing/mock-storage';

describe('CategoriesService', () => {
    let service: CategoriesService;
    let storage: MockStorage;

    beforeEach(async () => {
        storage = new MockStorage();
        await storage.create();
        service = new CategoriesService(storage as unknown as Storage);
    });

    it('debe iniciar sin categorías', async () => {
        const list = await service.list();
        expect(list).toEqual([]);
    });

    it('debe crear y listar categorías', async () => {
        const c: Category = { id: 'C1', name: 'Trabajo', color: '#00AAFF' };
        await service.create(c);
        const list = await service.list();
        expect(list.length).toBe(1);
        expect(list[0].name).toBe('Trabajo');
    });

    it('debe obtener por id', async () => {
        await service.create({ id: 'C1', name: 'Trabajo' });
        const cat = await service.get('C1');
        expect(cat?.name).toBe('Trabajo');
    });

    it('debe eliminar categoría', async () => {
        await service.create({ id: 'C1', name: 'Trabajo' });
        await service.create({ id: 'C2', name: 'Casa' });

        await service.remove('C1');
        const list = await service.list();
        expect(list.map(c => c.id)).toEqual(['C2']);
    });
});
