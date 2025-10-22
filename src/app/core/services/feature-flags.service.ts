import { Injectable, isDevMode } from '@angular/core';
import { AngularFireRemoteConfig } from '@angular/fire/compat/remote-config';

@Injectable({ providedIn: 'root' })
export class FeatureFlagsService {
    private readonly KEY_ENABLE_CATEGORIES = 'enable_categories';

    constructor(private rc: AngularFireRemoteConfig) { }

    /** Lee SIEMPRE desde Remote Config. Usa force=true para forzar red. */
    async getEnableCategories(force = false): Promise<boolean> {
        // 1) Configura el caché/timeout obteniendo los settings (es un Promise)
        const settings = await this.rc.settings;
        settings.minimumFetchIntervalMillis = isDevMode() ? 0 : 60 * 60 * 1000; // 0 en dev
        settings.fetchTimeoutMillis = 30000;

        // 2) Trae y activa los valores
        if (force) {
            await this.rc.fetch();
            await this.rc.activate();
        } else {
            await this.rc.fetchAndActivate();
        }

        // 3) Lee la flag
        return this.readBoolOrString(this.KEY_ENABLE_CATEGORIES, true);
    }

    private async readBoolOrString(key: string, fallback: boolean): Promise<boolean> {
        try {
            const b = await this.rc.getBoolean(key); // Promise<boolean>
            return !!b;
        } catch {
            try {
                const s = await this.rc.getString(key); // Promise<string>
                if (s === 'true' || s === '1') return true;
                if (s === 'false' || s === '0') return false;
                return fallback;
            } catch {
                return fallback;
            }
        }
    }
}
