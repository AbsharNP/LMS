import mongoose from 'mongoose';

const departmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    prefix: {
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

const Department = mongoose.models.Department || mongoose.model('Department', departmentSchema);

export default Department;
