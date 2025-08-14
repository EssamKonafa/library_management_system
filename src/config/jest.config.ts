import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
    preset: 'ts-jest',   
    testEnvironment: 'node',
    moduleFileExtensions: ['ts', 'js', 'json', 'node'],
    globals: {
        'ts-jest': {
            tsconfig:'tsconfig.spec.json',
            isolatedModules: true
        },
    },
    transform: {
        '^.+\\.ts$': 'ts-jest',
    },
    testMatch: ['**/?(*.)+(spec|test).[tj]s?(x)'],
};

export default config;
