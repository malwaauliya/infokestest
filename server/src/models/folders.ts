import { Model, Sequelize, DataTypes } from 'sequelize';

export default class Folders extends Model {
  public id!: number;
  public id_parent?: number;
  public name!: string;
  public children_count?: number;

  static initProcess(sequelize:Sequelize)  {
    const tableName = "folders";
    return sequelize.define<Folders>(tableName, {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      id_parent: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false
      }
    }, {
      tableName: tableName,
      timestamps: true,
      indexes: [
        {
          name: "folders_id",
          unique: true,
          using: "BTREE",
          fields: [
            { name: "id" },
          ]
        },
        {
          name: "folders_id_parent",
          using: "BTREE",
          fields: [
            { name: "id_parent" },
          ]
        },
        {
          name: "folder_name",
          using: "BTREE",
          fields: [
            { name: "name" },
          ]
        }
      ]
    });
  }
}
