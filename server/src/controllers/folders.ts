import { Request, Response, NextFunction } from 'express';
import { db_master } from '../models/index.js';
import { Op } from 'sequelize';

export const get = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id_parent = req.query?.id_parent || null;
    const keyword = req.query?.keyword || null
    const orderField = req.query.orderField || null;
    const orderSort = req.query.orderSort || null;
    let where: {[key: string]: any} = {id_parent};

    if (keyword) {
      where = {
          ...where,
          name: { [Op.like]: `%${keyword}%` }
      }
    }

    const data = await db_master.folders.findAndCountAll({
      where,
      order: (orderField && orderSort) ? [[orderField as string, orderSort as 'ASC' | 'DESC']] : [['name', 'ASC']]
    });

    res.status(200).json({ status: true, data });

  } catch (err) {
    const errorMessage = (err as Error).message;
    res.status(500).json({ status: false, message: errorMessage });
  }
  return next()
}

const checkData = async (id: Number) => {
  const check = await db_master.folders.findAndCountAll({
    attributes: ['id'],
    where: { id }
  })

  return check.count > 0 ? true : false;
}

const checkName = async (name: String, id_parent: Number) => {
  const where: {[key: string]: any} = { name, id_parent: null };
  if (id_parent) {
    where['id_parent'] = id_parent;
  }
  const checkName = await db_master.folders.findOne({
    where
  });

  return checkName;
}

export const store = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const body = req.body
    body.name = body?.name?.trim()
    let id_parent = body.id_parent || null;
    let name = body.name;

    const checkFileName = await checkName(name, id_parent);
    if (checkFileName && checkFileName.id) {
      res.status(401).json({ status: false, message: "Folder name is already use", error_code: '401' });
      return next()
    }
    const storeData = {
      id_parent: id_parent,
      name: name
    }
    const data = await db_master.folders.create(storeData)


    const folderData = {
      id: data.id,
      ...storeData
    };

    res.status(201).json({
      status: true,
      data: folderData,
    });
  } catch (err) {
    const errorMessage = (err as Error).message;
    res.status(500).json({ status: false, message: errorMessage });
  }
  return next()

}

export const update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = parseInt(req.params.id)
    const body = req.body
    body.name = body?.name?.trim()
    let id_parent = body.id_parent || null;
    let name = body.name;

    const check = await checkData(id);
    if (!check) {
      res.status(401).json({ status: false, message: "Folder data does'nt exists", error_code: '401' });
      return next()
    }

    const checkFileName = await checkName(name, id_parent);
    if (checkFileName && checkFileName.id) {
      res.status(401).json({ status: false, message: "Folder name is already use", error_code: '401' });
      return next()
    }

    const storeData = {
      name: name
    }

    await db_master.folders.update(storeData, {
      where: { id }
    });

    res.status(201).json({ status: true, data: storeData });
  } catch (err) {
    const errorMessage = (err as Error).message;
    res.status(500).json({ status: false, message: errorMessage });
  }
  return next()

}

export const destroy = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = parseInt(req.params.id)
    const check = await checkData(id);
    if (!check) {
      res.status(401).json({ status: false, message: "Folder data does'nt exists", error_code: '401' });
    }

    const data = await db_master.files.destroy({
      where: { id }
    })

    res.status(201).json({ status: true, data });
  } catch (err) {
    const errorMessage = (err as Error).message;
    res.status(500).json({ status: false, message: errorMessage });
  }
  return next()

}