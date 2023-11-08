import { Op } from "sequelize";
import Machine from "../models/Machine.js";

const searchMachine = async (req, res) => {
  try {
    const { machineId } = req.query;
    //Pagination
    const pageAsNumber = Number(req.query.page);
    const sizeAsNumber = Number(req.query.size);
    let page = 1;
    let size = 50;

    if (!Number.isNaN(pageAsNumber) && pageAsNumber >= 0) {
      page = pageAsNumber;
    }

    if (
      !Number.isNaN(sizeAsNumber) &&
      sizeAsNumber > 0 &&
      sizeAsNumber <= 500
    ) {
      size = sizeAsNumber;
    }
    const filters = [];

    if (machineId) {
      filters.push({
        machineId: {
          [Op.like]: `${machineId}%`,
        },
      });
    }
    //Datas
    const options = {
      where: {
        [Op.and]: filters,
      },
      limit: size,
      offset: (page - 1) * size,
      machine: [["machineId", "DESC"]],
    };
    const count = await Machine.count(options);
    const machines = await Machine.findAll(options);

    //Cas de succès
    res.status(200).json({
      machines,
      items: machines.length,
      results: count,
      currentPage: page,
      totalPages: Math.ceil(count / size),
    });
  } catch (error) {
    res.status(400).json({
      msg: "error " + error.message,
    });
  }
};

const createMachine = async (req, res) => {
  try {
    const data = req.body;
    const machine = await Machine.create({
      ...data,
    });
    //Cas de succès
    res.status(201).json({
      message: "Machine created",
      data: machine,
    });
  } catch (error) {
    res.status(400).json({
      msg: "error " + error.messag,
    });
  }
};

const getOneMachine = async (req, res) => {
  try {
    const options = {
      where: { machineId: req.params.machineId },
    };
    const machine = await Machine.findOne(options);
    res.status(200).json({
      data: machine,
    });
  } catch (error) {
    res.status(404).json({ error });
  }
};

const putMachine = async (req, res) => {
  try {
    const options = {
      where: { machineId: req.params.machineId },
    };
    const data = req.body;
    const machine = await Machine.findOne(options);

    machine.update({ ...data, machineId: req.params.machineId });

    res.status(201).json({
      message: "Machine updated",
      data: machine,
    });
  } catch (error) {
    res.status(400).json({ error });
  }
};

const deleteMachine = async (req, res) => {
  try {
    const options = { where: { machineId: req.params.machineId } };
    const machine = await Machine.findOne(options);
    machine.destroy();
    res.status(200).json({ message: "Machine has been deleted" });
  } catch (error) {
    res.status(400).json({ error });
  }
};

export {
  searchMachine,
  createMachine,
  getOneMachine,
  putMachine,
  deleteMachine,
};
