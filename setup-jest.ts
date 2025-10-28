import 'jest-preset-angular/setup-jest';

jest.mock('uuid', () => ({
  v4: () => 'mock-uuid'
}));