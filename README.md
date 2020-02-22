# Sequelize-Auto-Json

[Sequelize-Auto-Json](https://gitee.com/nanlicas/sequelize-auto-json) is a command line interface generating json models for [SequelizeJS](https://github.com/sequelize/sequelize).

Add Functions of converting existing database to json file.

Inspired and modified from [ozzysun](https://github.com/ozzysun/sequelize-auto).


## Install

    npm install -g sequelize-auto-json

## Prerequisites

You will need to install the correct dialect binding globally before using sequelize-auto.

Example for MySQL/MariaDB

`npm install -g mysql`

Example for Postgres

`npm install -g pg pg-hstore`

Example for Sqlite3

`npm install -g sqlite`

Example for MSSQL

`npm install -g mssql`

## Usage

    [node] sequelize-auto -h <host> -d <database> -u <user> -x [password] -p [port]  --dialect [dialect] -c [/path/to/config] -o [/path/to/models] -t [tableName] -C

    Options:
      -h, --host        IP/Hostname for the database.   [required]
      -d, --database    Database name.                  [required]
      -u, --user        Username for database.
      -x, --pass        Password for database.
      -p, --port        Port number for database.
      -c, --config      JSON file for Sequelize's constructor "options" flag object as defined here: https://sequelize.readthedocs.org/en/latest/api/sequelize/
      -o, --output      What directory to place the models.
      -e, --dialect     The dialect/engine that you're using: postgres, mysql, sqlite
      -a, --additional  Path to a json file containing model definitions (for all tables) which are to be defined within a model's configuration parameter. For more info: https://sequelize.readthedocs.org/en/latest/docs/models-definition/#configuration
      -t, --tables      Comma-separated names of tables to import
      -T, --skip-tables Comma-separated names of tables to skip
      -C, --camel       Use camel case to name models and fields
      -n, --no-write    Prevent writing the models to disk.
      -s, --schema      Database schema from which to retrieve tables
      -z, --typescript  Output models as typescript with a definitions file.
      -j  --json        Export json format model
### Use Json
  - Create Json
  ```
  sequelize-auto -o "./models" -d dbName -h localhost -u username -p 3306 -x yourpassword -e mysql -j
  ```
  - Build model from json
  ```
  const { getModel } = require('./node_modules/sequelize/lib/utils')
  const model = await getModel(sequelize, jsonfilePath)
  ```
  - json file format
  ```
  [
    {
      "id": {
        "type": "DataTypes.INTEGER(11)",
        "allowNull": false,
        "primaryKey": true,
        "comment": "null",
        "autoIncrement": true
      },
      "dbname": {
        "type": "DataTypes.STRING(45)",
        "allowNull": false,
        "autoIncrement": false,
        "comment": "null"
      },
      "tablename": {
        "type": "DataTypes.STRING(45)",
        "allowNull": false,
        "autoIncrement": false,
        "comment": "null"
      },
      "model": {
        "type": "DataTypes.STRING(45)",
        "allowNull": false,
        "autoIncrement": false,
        "comment": "null"
      },
      "createdDate": {
        "type": "DataTypes.DATE",
        "allowNull": true,
        "defaultValue": "CURRENT_TIMESTAMP",
        "autoIncrement": false,
        "comment": "null"
      }
    }, {
      "tableName": "models"
    }
  ]
  ```

## Example

    sequelize-auto -o "./models" -d sequelize_auto_test -h localhost -u my_username -p 5432 -x my_password -e postgres -j

Produces a file/files such as ./models/Users.js which looks like:

    /* jshint indent: 2 */

    module.exports = function(sequelize, DataTypes) {
      return sequelize.define('Users', {
        'id': {
          type: DataTypes.INTEGER(11),
          allowNull: false,
          primaryKey: true,
          autoIncrement: true
        },
        'username': {
          type: DataTypes.STRING,
          allowNull: true
        },
        'touchedAt': {
          type: DataTypes.DATE,
          allowNull: true
        },
        'aNumber': {
          type: DataTypes.INTEGER(11),
          allowNull: true
        },
        'bNumber': {
          type: DataTypes.INTEGER(11),
          allowNull: true
        },
        'validateTest': {
          type: DataTypes.INTEGER(11),
          allowNull: true
        },
        'validateCustom': {
          type: DataTypes.STRING,
          allowNull: false
        },
        'dateAllowNullTrue': {
          type: DataTypes.DATE,
          allowNull: true
        },
        'defaultValueBoolean': {
          type: DataTypes.BOOLEAN,
          allowNull: true,
          defaultValue: '1'
        },
        'createdAt': {
          type: DataTypes.DATE,
          allowNull: false
        },
        'updatedAt': {
          type: DataTypes.DATE,
          allowNull: false
        }
      }, {
        tableName: 'Users',
        freezeTableName: true
      });
    };


Which makes it easy for you to simply [Sequelize.import](http://docs.sequelizejs.com/en/latest/docs/models-definition/#import) it.

## Configuration options

For the `-c, --config` option the following JSON/configuration parameters are defined by Sequelize's `options` flag within the constructor. For more info:

[https://sequelize.readthedocs.org/en/latest/api/sequelize/](https://sequelize.readthedocs.org/en/latest/api/sequelize/)

## Programmatic API

```js
var SequelizeAuto = require('sequelize-auto')
var auto = new SequelizeAuto('database', 'user', 'pass');

auto.run(function (err) {
  if (err) throw err;

  console.log(auto.tables); // table list
  console.log(auto.foreignKeys); // foreign key list
});

With options:
var auto = new SequelizeAuto('database', 'user', 'pass', {
    host: 'localhost',
    dialect: 'mysql'|'mariadb'|'sqlite'|'postgres'|'mssql',
    directory: false, // prevents the program from writing to disk
    port: 'port',
    additional: {
        timestamps: false
        //...
    },
    tables: ['table1', 'table2', 'table3'],
    json: true // default is false ,export json
    //...
})
```

## Typescript

Add -z to cli options or `typescript: true` to programmatic options. Model usage in a ts file:

```js
// All models, can put in or extend to a db object at server init
import * as dbTables from './models/db.tables';
const tables = dbTables.getModels(sequelize); //:dbTables.ITable
tables.Device.findAll
// Single models
import * as dbDef from './models/db.d';
const devices:dbDef.DeviceModel = sequelize.import('./models/Device');
devices.findAll
```

## Testing

You must setup a database called `sequelize_auto_test` first, edit the `test/config.js` file accordingly, and then enter in any of the following:

    # for all
    npm run test

    # mysql only
    npm run test-mysql

    # postgres only
    npm run test-postgres

    # postgres native only
    npm run test-postgres-native

    # sqlite only
    npm run test-sqlite
