import User, { IUser } from '../models/user.model';
import ApiError from '../utils/ApiError';

export class UserService {
  /**
   * Create a new user
   */
  async createUser(userData: Partial<IUser>): Promise<IUser> {
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      throw new ApiError(400, 'Email already exists');
    }
    return User.create(userData);
  }

  /**
   * Get user by ID
   */
  async getUserById(id: string): Promise<IUser | null> {
    const user = await User.findById(id).select('-password');
    if (!user) {
      throw new ApiError(404, 'User not found');
    }
    return user;
  }

  /**
   * Get users with pagination
   */
  async getUsers(
    page: number = 1,
    limit: number = 10
  ): Promise<{ users: IUser[]; total: number }> {
    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      User.find().select('-password').skip(skip).limit(limit),
      User.countDocuments(),
    ]);
    return { users, total };
  }

  /**
   * Update user
   */
  async updateUser(
    id: string,
    updateData: Partial<IUser>
  ): Promise<IUser | null> {
    // Remove password from update data if present
    if (updateData.password) {
      delete updateData.password;
    }

    const user = await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).select('-password');

    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    return user;
  }

  /**
   * Delete user
   */
  async deleteUser(id: string): Promise<void> {
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }
  }

  /**
   * Authenticate user
   */
  async authenticateUser(email: string, password: string): Promise<IUser> {
    const user = await User.findOne({ email });
    if (!user) {
      throw new ApiError(401, 'Invalid credentials');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new ApiError(401, 'Invalid credentials');
    }

    return user;
  }
}

export default new UserService();
