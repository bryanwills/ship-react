import fs from 'node:fs';
import path from 'node:path';

import { Migration } from 'migrator/types';

import db from 'db';

import schema from './migration-version.schema';
import { MigrationVersion } from './migration-version-types';

const service = db.createService<MigrationVersion>('__migrationVersion', {
  schemaValidator: (obj) => schema.parseAsync(obj),
});

const migrationPaths = path.join(__dirname, '../migrations');
const id = 'migration_version';

const getMigrationNames = (): string[] => fs.readdirSync(migrationPaths).filter((file) => !file.endsWith('.js.map'));

const getCurrentMigrationVersion = () =>
  service.findOne({ _id: id }).then((doc: MigrationVersion | null) => {
    if (!doc) {
      return 0;
    }

    return doc.version;
  });

const getMigrations = (): Migration[] => {
  const names = getMigrationNames();
  const migrations = names.map((name: string) => {
    const migrationPath = path.join(migrationPaths, name);

    // eslint-disable-next-line ts/no-require-imports
    return require(migrationPath);
  });

  return migrations.map((m) => m.default);
};

const setNewMigrationVersion = (version: number) =>
  service.atomic.updateOne(
    { _id: id },
    {
      $set: {
        version,
      },
      $setOnInsert: {
        _id: id,
      },
    },
    {},
    { upsert: true },
  );

export default Object.assign(service, {
  getCurrentMigrationVersion,
  getMigrations,
  setNewMigrationVersion,
});
