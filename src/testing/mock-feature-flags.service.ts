export class MockFeatureFlagsService {
  getEnableCategories = jest.fn().mockResolvedValue(true);
}
