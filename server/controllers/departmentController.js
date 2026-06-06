import mongoose from 'mongoose';
import Department from '../models/departmentModel.js';

const isValidDepartmentId = (id) => mongoose.Types.ObjectId.isValid(id);

export const getDepartments = async (req, res) => {
  try {
    const departments = await Department.find().sort({ createdAt: -1 });

    return res.json({ departments });
  } catch (err) {
    return res.status(500).json({
      message: 'Unable to fetch departments',
      error: err.message,
    });
  }
};

export const createDepartment = async (req, res) => {
  try {
    const department = await Department.create(req.body);

    return res.status(201).json({ department });
  } catch (err) {
    return res.status(400).json({
      message: 'Unable to create department',
      error: err.message,
    });
  }
};

export const updateDepartment = async (req, res) => {
  try {
    if (!isValidDepartmentId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid department id' });
    }

    const department = await Department.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }

    return res.json({
      message: 'Department updated successfully',
      department,
    });
  } catch (err) {
    return res.status(400).json({
      message: 'Unable to update department',
      error: err.message,
    });
  }
};

export const deleteDepartment = async (req, res) => {
  try {
    if (!isValidDepartmentId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid department id' });
    }

    const department = await Department.findByIdAndDelete(req.params.id);

    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }

    return res.json({
      message: 'Department deleted successfully',
      department,
    });
  } catch (err) {
    return res.status(500).json({
      message: 'Unable to delete department',
      error: err.message,
    });
  }
};
