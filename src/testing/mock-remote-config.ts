// Simula la interfaz mínima que usa FeatureFlagsService
export class MockAngularFireRemoteConfig {
  public settings = Promise.resolve({
    minimumFetchIntervalMillis: 0,
    fetchTimeoutMillis: 30000
  });

  // controlables desde los tests
  private boolMap = new Map<string, boolean>();
  private strMap = new Map<string, string>();

  setBoolean(key: string, value: boolean) { this.boolMap.set(key, value); }
  setString(key: string, value: string) { this.strMap.set(key, value); }

  async fetch(): Promise<void> { /* no-op */ }
  async activate(): Promise<void> { /* no-op */ }
  async fetchAndActivate(): Promise<void> { /* no-op */ }

  async getBoolean(key: string): Promise<boolean> {
    if (!this.boolMap.has(key)) {
      // Simula que a veces no existe como boolean → deja que el servicio haga fallback a string
      throw new Error('not boolean');
    }
    return !!this.boolMap.get(key);
  }

  async getString(key: string): Promise<string> {
    if (!this.strMap.has(key)) return '';
    return this.strMap.get(key) as string;
  }
}
