import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
    },
    course_code: {
      type: String,
      trim: true,
      uppercase: true,
    },
    delete_status: {
      type: String,
      default: '0',
    },
    deleted_at: {
      type: String,
      default: '',
    },
    deleted_by: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const Course = mongoose.models.Course || mongoose.model('Course', courseSchema);

export default Course;
