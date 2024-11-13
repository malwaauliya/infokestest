import _sequelize, { Sequelize } from 'sequelize';
import config from '../config/config.js';
import _folders from  "./folders.js";
import _files from  "./files.js";

export const sequelize = _sequelize;

export const initModels = (sequelize: Sequelize) => {
  const folders = _folders.initProcess(sequelize);
  const files = _files.initProcess(sequelize);

  return {
    folders,
    files
  };
}


export const db_master = initModels(new Sequelize(
    config.env.MASTER_DB_DBNAME,
    config.env.MASTER_DB_USER,
    config.env.MASTER_DB_PASSWORD,
    {
      host: config.env.MASTER_DB_HOST,
      port: config.env.MASTER_DB_PORT,
      dialect: config.env.MASTER_DB_DIALECT,
      timezone: config.env.MASTER_DB_TIMEZONE, // for writing to database
    }
));

//ORM
//folders, folders : one to one
db_master['folders'].belongsTo(db_master['folders'], { foreignKey: 'id_parent', as: 'parent'});
//folders, folders : one to many
db_master['folders'].hasMany(db_master['folders'], { foreignKey: 'id_parent', as: 'children' });
//files, folders : one to one
db_master['files'].belongsTo(db_master['folders'], { foreignKey: 'id_folder', targetKey: 'id'});
//folder, files : one to many
db_master['folders'].hasMany(db_master['files'], { foreignKey: 'id_folder' });


