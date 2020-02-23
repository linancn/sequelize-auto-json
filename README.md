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
      -e, --dialect     The dialect/engine that you're using: postgres, mysql, sqlite, mssql
      -a, --additional  Path to a json file containing model definitions (for all tables) which are to be defined within a model's configuration parameter. For more info: https://sequelize.readthedocs.org/en/latest/docs/models-definition/#configuration
      -t, --tables      Comma-separated names of tables to import
      -T, --skip-tables Comma-separated names of tables to skip
      -C, --camel       Use camel case to name models and fields
      -n, --no-write    Prevent writing the models to disk.
      -s, --schema      Database schema from which to retrieve tables
      -z, --typescript  Output models as typescript with a definitions file.
      -j  --json        Export json format model

### Use Json Option

  - Create Json
  ```
  sequelize-auto-json -o "./models" -d dbName -h localhost -u username -p 3306 -x yourpassword -e mysql -j
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
      "tableName": "models"
    },
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
    }
  ]
  ```

Which makes it easy for you to simply [Sequelize.import](http://docs.sequelizejs.com/en/latest/docs/models-definition/#import) it.

## Configuration options

For the `-c, --config` option the following JSON/configuration parameters are defined by Sequelize's `options` flag within the constructor. For more info:

[https://sequelize.readthedocs.org/en/latest/api/sequelize/](https://sequelize.readthedocs.org/en/latest/api/sequelize/)