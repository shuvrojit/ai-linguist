import mongoose, { Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUserProfile {
  bio?: string;
  avatar?: string;
  location?: string;
  website?: string;
  phoneNumber?: string;
  dateOfBirth?: Date;
  interests?: string[];
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
  };
}

export interface IUser extends Document {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'user' | 'admin';
  profile: IUserProfile;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
  fullName: string;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    profile: {
      bio: String,
      avatar: String,
      location: String,
      website: String,
      phoneNumber: String,
      dateOfBirth: Date,
      interests: [String],
      socialLinks: {
        twitter: String,
        linkedin: String,
        github: String,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Virtual for user's full name
userSchema.virtual('fullName').get(function (this: IUser) {
  return `${this.firstName} ${this.lastName}`;
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
  // Ensure virtuals are included when converting to JSON
  userSchema.set('toJSON', { virtuals: true });
  userSchema.set('toObject', { virtuals: true });
};

const User = mongoose.model<IUser>('User', userSchema);

export default User;
