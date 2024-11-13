import { Model, Sequelize, DataTypes } from 'sequelize';
  
export default class Files extends Model {
  public id!: number;
  public id_folder!: number;
  public name!: string;
  public format!: string;

  static initProcess(sequelize:Sequelize)  {
    const tableName = "files";
    return sequelize.define<Files>(tableName, {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      id_folder: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      format: {
        type: DataTypes.STRING(5),
        allowNull: false
      }
    }, {
      tableName: tableName,
      timestamps: true,
      indexes: [
        {
          name: "files_id",
          unique: true,
          using: "BTREE",
          fields: [
            { name: "id" },
          ]
        },
        {
          name: "files_id_folder",
          using: "BTREE",
          fields: [
            { name: "id_folder" },
          ]
        },
        {
          name: "files_name",
          using: "BTREE",
          fields: [
            { name: "name" },
          ]
        },
        {
          name: "files_format",
          using: "BTREE",
          fields: [
            { name: "format" },
          ]
        }
      ]
    });
  }
}
