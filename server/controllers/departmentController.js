import mongoose from 'mongoose';
import Department from '../models/departmentModel.js';

const isValidDepartmentId = (id) => mongoose.Types.ObjectId.isValid(id);

const formatDateTime = () => {
  const now = new Date();
  const pad = (value) => String(value).padStart(2, '0');

  return [
    now.getFullYear(),
    pad(now.getMonth() + 1),
    pad(now.getDate()),
  ].join('-') + ` ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
};

export const getDepartments = async (req, res) => {
  try {
    const departments = await Department.find({ delete_status: '0' }).sort({ createdAt: -1 });

    return res.json({ departments });
  } catch (err) {
    return res.status(500).json({
      message: 'Unable to fetch departments',
      error: err.message,
      toast: {
        message: 'Unable to fetch departments',
        tone: 'error',
      },
    });
  }
};

export const createDepartment = async (req, res) => {
  try {
    const { name, prefix } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        message: 'Department name is required',
        toast: { message: 'Department name is required', tone: 'error' }
      });
    }

    if (!prefix || !prefix.trim()) {
      return res.status(400).json({
        message: 'Department prefix is required',
        toast: { message: 'Department prefix is required', tone: 'error' }
      });
    }

    // Check unique name among active departments
    const existingName = await Department.findOne({
      name: name.trim(),
      delete_status: '0'
    });
    if (existingName) {
      return res.status(400).json({
        message: 'Department name already exists',
        toast: { message: 'Department name already exists', tone: 'error' }
      });
    }

    // Check unique prefix among active departments
    const existingPrefix = await Department.findOne({
      prefix: prefix.trim().toUpperCase(),
      delete_status: '0'
    });
    if (existingPrefix) {
      return res.status(400).json({
        message: 'Department prefix already exists',
        toast: { message: 'Department prefix already exists', tone: 'error' }
      });
    }

    const department = await Department.create({
      name: name.trim(),
      prefix: prefix.trim().toUpperCase()
    });

    return res.status(201).json({ department });
  } catch (err) {
    return res.status(400).json({
      message: 'Unable to create department',
      error: err.message,
      toast: {
        message: err.message || 'Unable to create department',
        tone: 'error',
      },
    });
  }
};

export const updateDepartment = async (req, res) => {
  try {
    if (!isValidDepartmentId(req.params.id)) {
      return res.status(400).json({
        message: 'Invalid department id',
        toast: {
          message: 'Invalid department id',
          tone: 'error',
        },
      });
    }

    const { name, prefix } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        message: 'Department name is required',
        toast: { message: 'Department name is required', tone: 'error' }
      });
    }

    if (!prefix || !prefix.trim()) {
      return res.status(400).json({
        message: 'Department prefix is required',
        toast: { message: 'Department prefix is required', tone: 'error' }
      });
    }

    // Check unique name among other active departments
    const existingName = await Department.findOne({
      _id: { $ne: req.params.id },
      name: name.trim(),
      delete_status: '0'
    });
    if (existingName) {
      return res.status(400).json({
        message: 'Department name already exists',
        toast: { message: 'Department name already exists', tone: 'error' }
      });
    }

    // Check unique prefix among other active departments
    const existingPrefix = await Department.findOne({
      _id: { $ne: req.params.id },
      prefix: prefix.trim().toUpperCase(),
      delete_status: '0'
    });
    if (existingPrefix) {
      return res.status(400).json({
        message: 'Department prefix already exists',
        toast: { message: 'Department prefix already exists', tone: 'error' }
      });
    }

    const department = await Department.findByIdAndUpdate(
      req.params.id,
      {
        name: name.trim(),
        prefix: prefix.trim().toUpperCase()
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!department) {
      return res.status(404).json({
        message: 'Department not found',
        toast: {
          message: 'Department not found',
          tone: 'error',
        },
      });
    }

    return res.json({
      message: 'Department updated successfully',
      department,
    });
  } catch (err) {
    return res.status(400).json({
      message: 'Unable to update department',
      error: err.message,
      toast: {
        message: err.message || 'Unable to update department',
        tone: 'error',
      },
    });
  }
};

export const deleteDepartment = async (req, res) => {
  try {
    if (!isValidDepartmentId(req.params.id)) {
      return res.status(400).json({
        message: 'Invalid department id',
        toast: {
          message: 'Invalid department id',
          tone: 'error',
        },
      });
    }

    const department = await Department.findOneAndUpdate(
      { _id: req.params.id, delete_status: '0' },
      {
        delete_status: '1',
        deleted_at: formatDateTime(),
        deleted_by: req.user?.id || '',
      },
      { new: true },
    );

    if (!department) {
      return res.status(404).json({
        message: 'Department not found',
        toast: {
          message: 'Department not found',
          tone: 'error',
        },
      });
    }

    return res.json({
      message: 'Department deleted successfully',
      department,
    });
  } catch (err) {
    return res.status(500).json({
      message: 'Unable to delete department',
      error: err.message,
      toast: {
        message: err.message || 'Unable to delete department',
        tone: 'error',
      },
    });
  }
};
