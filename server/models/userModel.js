import mongoose from 'mongoose';

const formatDateTime = () => {
  const now = new Date();
  const pad = (value) => String(value).padStart(2, '0');

  return [
    now.getFullYear(),
    pad(now.getMonth() + 1),
    pad(now.getDate()),
  ].join('-') + ` ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
};

const userSchema = new mongoose.Schema(
  {
    f_name: {
      type: String,
      required: true,
      trim: true,
    },
    l_name: {
      type: String,
      trim: true,
      default: '',
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    role: {
      type: String,
      default: 'user',
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    token: {
      type: String,
      default: '',
    },
    created_at: {
      type: String,
      default: formatDateTime,
    },
    created_by: {
      type: String,
      default: 'dev',
    },
    updated_at: {
      type: String,
      default: formatDateTime,
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
    versionKey: false,
  },
);

userSchema.pre('save', function updateTimestamp() {
  if (!this.isNew) {
    this.updated_at = formatDateTime();
  }
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
