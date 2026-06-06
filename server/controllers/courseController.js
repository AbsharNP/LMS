import mongoose from 'mongoose';
import Course from '../models/courseModel.js';

const isValidCourseId = (id) => mongoose.Types.ObjectId.isValid(id);

const formatDateTime = () => {
  const now = new Date();
  const pad = (value) => String(value).padStart(2, '0');

  return [
    now.getFullYear(),
    pad(now.getMonth() + 1),
    pad(now.getDate()),
  ].join('-') + ` ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
};

export const getCourses = async (req, res) => {
  try {
    const courses = await Course.find({ delete_status: '0' }).populate('department', 'name').sort({ createdAt: -1 });

    return res.json({ courses });
  } catch (err) {
    return res.status(500).json({
      message: 'Unable to fetch courses',
      error: err.message,
      toast: {
        message: 'Unable to fetch courses',
        tone: 'error',
      },
    });
  }
};

export const getCourse = async (req, res) => {
  try {
    if (!isValidCourseId(req.params.id)) {
      return res.status(400).json({
        message: 'Invalid course id',
        toast: {
          message: 'Invalid course id',
          tone: 'error',
        },
      });
    }

    const course = await Course.findOne({ _id: req.params.id, delete_status: '0' }).populate('department', 'name');

    if (!course) {
      return res.status(404).json({
        message: 'Course not found',
        toast: {
          message: 'Course not found',
          tone: 'error',
        },
      });
    }

    return res.json({ course });
  } catch (err) {
    return res.status(500).json({
      message: 'Unable to fetch course',
      error: err.message,
      toast: {
        message: 'Unable to fetch course',
        tone: 'error',
      },
    });
  }
};

export const createCourse = async (req, res) => {
  try {
    const { title, department, course_code } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        message: 'Course title is required',
        toast: { message: 'Course title is required', tone: 'error' }
      });
    }

    if (!department || !mongoose.Types.ObjectId.isValid(department)) {
      return res.status(400).json({
        message: 'Valid department ID is required',
        toast: { message: 'Valid department ID is required', tone: 'error' }
      });
    }

    if (!course_code || !course_code.trim()) {
      return res.status(400).json({
        message: 'Course code is required',
        toast: { message: 'Course code is required', tone: 'error' }
      });
    }

    // Check if course code is unique among active courses
    const existingCode = await Course.findOne({
      course_code: course_code.trim().toUpperCase(),
      delete_status: '0'
    });
    if (existingCode) {
      return res.status(400).json({
        message: 'Course code already exists',
        toast: { message: 'Course code already exists', tone: 'error' }
      });
    }

    const course = await Course.create({
      title: title.trim(),
      department,
      course_code: course_code.trim().toUpperCase()
    });
    await course.populate('department', 'name');

    res.status(201).json({ course });
  } catch (err) {
    res.status(400).json({
      message: 'Unable to create course',
      error: err.message,
      toast: {
        message: err.message || 'Unable to create course',
        tone: 'error',
      },
    });
  }
};

export const updateCourse = async (req, res) => {
  try {
    if (!isValidCourseId(req.params.id)) {
      return res.status(400).json({
        message: 'Invalid course id',
        toast: {
          message: 'Invalid course id',
          tone: 'error',
        },
      });
    }

    const { title, department, course_code } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        message: 'Course title is required',
        toast: { message: 'Course title is required', tone: 'error' }
      });
    }

    if (!department || !mongoose.Types.ObjectId.isValid(department)) {
      return res.status(400).json({
        message: 'Valid department ID is required',
        toast: { message: 'Valid department ID is required', tone: 'error' }
      });
    }

    if (!course_code || !course_code.trim()) {
      return res.status(400).json({
        message: 'Course code is required',
        toast: { message: 'Course code is required', tone: 'error' }
      });
    }

    // Check if course code is unique among other active courses
    const existingCode = await Course.findOne({
      _id: { $ne: req.params.id },
      course_code: course_code.trim().toUpperCase(),
      delete_status: '0'
    });
    if (existingCode) {
      return res.status(400).json({
        message: 'Course code already exists',
        toast: { message: 'Course code already exists', tone: 'error' }
      });
    }

    const course = await Course.findByIdAndUpdate(
      req.params.id,
      {
        title: title.trim(),
        department,
        course_code: course_code.trim().toUpperCase()
      },
      {
        new: true,
        runValidators: true,
      }
    ).populate('department', 'name');

    if (!course) {
      return res.status(404).json({
        message: 'Course not found',
        toast: {
          message: 'Course not found',
          tone: 'error',
        },
      });
    }

    return res.json({
      message: 'Course updated successfully',
      course,
    });
  } catch (err) {
    return res.status(400).json({
      message: 'Unable to update course',
      error: err.message,
      toast: {
        message: err.message || 'Unable to update course',
        tone: 'error',
      },
    });
  }
};

export const deleteCourse = async (req, res) => {
  try {
    if (!isValidCourseId(req.params.id)) {
      return res.status(400).json({
        message: 'Invalid course id',
        toast: {
          message: 'Invalid course id',
          tone: 'error',
        },
      });
    }

    const course = await Course.findOneAndUpdate(
      { _id: req.params.id, delete_status: '0' },
      {
        delete_status: '1',
        deleted_at: formatDateTime(),
        deleted_by: req.user?.id || '',
      },
      { new: true },
    );

    if (!course) {
      return res.status(404).json({
        message: 'Course not found',
        toast: {
          message: 'Course not found',
          tone: 'error',
        },
      });
    }

    return res.json({
      message: 'Course deleted successfully',
      course,
    });
  } catch (err) {
    return res.status(500).json({
      message: 'Unable to delete course',
      error: err.message,
      toast: {
        message: err.message || 'Unable to delete course',
        tone: 'error',
      },
    });
  }
};
