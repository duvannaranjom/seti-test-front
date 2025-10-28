/** @type {import('jest').Config} */
module.exports = {
  preset: 'jest-preset-angular',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],

  // 👇 usa jest-preset-angular para TS/JS/MJS/HTML
  transform: {
    '^.+\\.(ts|js|mjs|html)$': [
      'jest-preset-angular',
      { tsconfig: 'tsconfig.spec.json' }
    ],
    // 👇 y babel solo para .mjs en node_modules de Angular/Ionic/Stencil
    'node_modules/(@angular|@ionic|@stencil/core|ionicons)/.*\\.mjs$': 'babel-jest',
  },

  // 👇 NO ignores esos paquetes ESM (que sí deben transformarse)
  transformIgnorePatterns: [
    'node_modules/(?!(@angular|@ionic|@stencil/core|ionicons)/)',
  ],

  moduleFileExtensions: ['ts', 'html', 'js', 'json', 'mjs'],

  // 👇 stringificar templates .html/.svg (clave para tu error)
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.spec.json',
      stringifyContentPathRegex: '\\.(html|svg)$',
      isolatedModules: true,
    },
  },

  // 👇 evita que estilos rompan pruebas
  moduleNameMapper: {
    '\\.(css|scss)$': 'identity-obj-proxy',
  },

  collectCoverage: true,
  coverageReporters: ['html', 'text-summary'],
  coverageDirectory: 'coverage/jest',
};
