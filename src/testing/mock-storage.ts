import type { Storage } from '@ionic/storage-angular';

export class MockStorage implements Partial<Storage> {
  private store = new Map<string, any>();

  // ✅ firma compatible con Storage
  async create(): Promise<Storage> {
    return this as unknown as Storage;
  }

  async get(key: string): Promise<any> {
    return this.store.get(key);
  }

  async set(key: string, value: any): Promise<any> {
    this.store.set(key, value);
    return true;
  }

  async remove(key: string): Promise<void> {
    this.store.delete(key);
  }

  async clear(): Promise<void> {
    this.store.clear();
  }
}
