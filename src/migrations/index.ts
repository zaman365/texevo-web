import * as migration_20261005_235419_initial from './20261005_235419_initial';

export const migrations = [
  {
    up: migration_20261005_235419_initial.up,
    down: migration_20261005_235419_initial.down,
    name: '20261005_235419_initial'
  },
];
