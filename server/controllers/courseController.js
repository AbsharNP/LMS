import mongoose from 'mongoose';
import Course from '../models/courseModel.js';

const isValidCourseId = (id) => mongoose.Types.ObjectId.isValid(id);

export const getCourses = async (req, res) => {
  try {
    const courses = await Course.find().populate('department', 'name').sort({ createdAt: -1 });

    return res.json({ courses });
  } catch (err) {
    return res.status(500).json({
      message: 'Unable to fetch courses',
      error: err.message,
    });
  }
};

export const getCourse = async (req, res) => {
  try {
    if (!isValidCourseId(req.params.id)) {
      return res.status(400).json({
        message: 'Invalid course id',
      });
    }

    const course = await Course.findById(req.params.id).populate('department', 'name');

    if (!course) {
      return res.status(404).json({
        message: 'Course not found',
      });
    }

    return res.json({ course });
  } catch (err) {
    return res.status(500).json({
      message: 'Unable to fetch course',
      error: err.message,
    });
  }
};

export const createCourse = async (req, res) => {
  try {
    const course = await Course.create(req.body);
    await course.populate('department', 'name');

    res.status(201).json({ course });
  } catch (err) {
    res.status(400).json({
      message: 'Unable to create course',
      error: err.message,
    });
  }
};

export const updateCourse = async (req, res) => {
  try {
    if (!isValidCourseId(req.params.id)) {
      return res.status(400).json({
        message: 'Invalid course id',
      });
    }

    const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('department', 'name');

    if (!course) {
      return res.status(404).json({
        message: 'Course not found',
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
    });
  }
};

export const deleteCourse = async (req, res) => {
  try {
    if (!isValidCourseId(req.params.id)) {
      return res.status(400).json({
        message: 'Invalid course id',
      });
    }

    const course = await Course.findByIdAndDelete(req.params.id);

    if (!course) {
      return res.status(404).json({
        message: 'Course not found',
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
    });
  }
};
