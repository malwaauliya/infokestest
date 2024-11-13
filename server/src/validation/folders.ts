import Joi from "joi";
export const getSchema = Joi.object({
  id_parent: Joi.number().allow(null,''),
  keyword: Joi.string().allow(null,''),
  orderField: Joi.string().allow(null,'', 'name','createdAt','updatedAt'),
  orderSort: Joi.string().allow(null,'', 'ASC','DESC'),
});

export const storeSchema = Joi.object({
  id_parent: Joi.number().allow(null,''),
  name: Joi.string().required()
});