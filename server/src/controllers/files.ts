import { Request, Response, NextFunction } from 'express';
import { db_master } from '../models/index.js';
import { Op } from 'sequelize';

export const get = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    let where: { [key: string]: any } = {
      id_folder: req.query?.id_folder
    };
    const keyword = req.query?.keyword || null
    const orderField = req.query.orderField || null;
    const orderSort = req.query.orderSort || null;

    if (keyword) {
      where = {
          ...where,
          name: { [Op.like]: `%${keyword}%` }
      }
    }

    const data = await db_master.files.findAndCountAll({
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
  const check = await db_master.files.findAndCountAll({
    attributes: ['id'],
    where: { id }
  })

  return check.count > 0 ? true : false;
}

const checkName = async (id_folder: Number, name: String) => {
  const checkName = await db_master.files.findOne({
    where: {
      id_folder,
      name
    }
  });

  return checkName;
}

export const store = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const body = req.body
    body.name = body?.name?.trim()
    let id_folder = body.id_folder;
    let name = body.name;
    let format = body.format;

    const checkFileName = await checkName(id_folder, name);
    if (checkFileName && checkFileName.id) {
      res.status(401).json({ status: false, message: "File name is already use", error_code: '401' });
      return next()
    }
    const storeData = {
      id_folder: id_folder,
      name: name,
      format: format
    }
    const data = await db_master.files.create(storeData)


    const fileData = {
      id: data.id,
      ...storeData
    };

    res.status(201).json({
      status: true,
      data: fileData,
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
    let id_folder = body.id_folder;
    let name = body.name;
    let format = body.format;

    const check = await checkData(id);
    if (!check) {
      res.status(401).json({ status: false, message: "File data does'nt exists", error_code: '401' });
      return next()
    }

    const checkFileName = await checkName(id_folder, name);
    if (checkFileName && checkFileName.id != id) {
      res.status(401).json({ status: false, message: "File name is already use", error_code: '401' });
      return next()
    }

    const storeData = {
      name: name,
      format: format
    }

    await db_master.files.update(storeData, {
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
      res.status(401).json({ status: false, message: "File data does'nt exists", error_code: '401' });
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