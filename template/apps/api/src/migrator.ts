/* eslint-disable simple-import-sort/imports, import/first */
// allows to require modules relative to /src folder
// for example: require('lib/mongo/idGenerator')
// all options can be found here: https://gist.github.com/branneman/8048520
import moduleAlias from 'module-alias'; // read aliases from package json

moduleAlias.addPath(__dirname);
moduleAlias();

import 'dotenv/config';

import migrator from 'migrator/index';

migrator.exec();
