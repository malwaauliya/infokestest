import Joi from "joi";
export const getSchema = Joi.object({
  id_folder: Joi.number().required(),
  keyword: Joi.string().allow(null,''),
  orderField: Joi.string().allow(null,'', 'name','createdAt','updatedAt'),
  orderSort: Joi.string().allow(null,'', 'ASC','DESC'),
});

export const storeSchema = Joi.object({
  id_folder: Joi.number().required(),
  name: Joi.string().required(),
  format: Joi.string().required()
});