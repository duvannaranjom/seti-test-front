import { MockAngularFireRemoteConfig } from '../../../testing/mock-remote-config';
import { FeatureFlagsService } from './feature-flags.service';

describe('FeatureFlagsService', () => {
    let service: FeatureFlagsService;
    let rc: MockAngularFireRemoteConfig;

    beforeEach(() => {
        rc = new MockAngularFireRemoteConfig();
        service = new FeatureFlagsService(rc as any);
    });

    it('debe devolver true cuando RC boolean es true', async () => {
        rc.setBoolean('enable_categories', true);
        const val = await service.getEnableCategories(true);
        expect(val).toBe(true);
    });

    it('debe devolver false cuando RC boolean es false', async () => {
        rc.setBoolean('enable_categories', false);
        const val = await service.getEnableCategories(true);
        expect(val).toBe(false);
    });

    it('fallback: usa string "1" como true', async () => {
        rc.setString('enable_categories', '1'); // sin boolean -> forzar fallback
        const val = await service.getEnableCategories(true);
        expect(val).toBe(true);
    });

    it('fallback: usa string "false" como false', async () => {
        rc.setString('enable_categories', 'false');
        const val = await service.getEnableCategories(true);
        expect(val).toBe(false);
    });

    it('cuando no hay valor en RC, usa default true', async () => {
        const val = await service.getEnableCategories(true);
        expect(val).toBe(true);
    });

    it('ajusta settings de RC (minimumFetchIntervalMillis y fetchTimeoutMillis)', async () => {
        await service.getEnableCategories(false);

        const settings = await (rc as any).settings;
        expect(settings.minimumFetchIntervalMillis).toBeDefined();
        expect(settings.fetchTimeoutMillis).toBe(30000);
    });
});
