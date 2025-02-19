import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { ScholarshipModel } from '../../models';

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Scholarship Model Test', () => {
  beforeEach(async () => {
    await ScholarshipModel.deleteMany({});
  });

  it('should create & save scholarship successfully', async () => {
    const validScholarship = {
      title: 'STEM Excellence Scholarship',
      organization: 'University of Example',
      amount: '$10,000',
      deadline: new Date('2024-12-31'),
      eligibility: ['GPA 3.5+', 'STEM major'],
      requirements: ['Transcript', 'Essay', 'Recommendations'],
      field_of_study: ['Computer Science', 'Engineering'],
      degree_level: ['Bachelor'],
      country: 'United States',
      link: 'https://example.edu/scholarship',
      status: 'active',
      additional_info: new Map([
        ['applicationProcess', 'Online submission'],
        ['contact', 'scholarships@example.edu'],
      ]),
    };

    const scholarship = new ScholarshipModel(validScholarship);
    const savedScholarship = await scholarship.save();

    expect(savedScholarship._id).toBeDefined();
    expect(savedScholarship.title).toBe(validScholarship.title);
    expect(savedScholarship.organization).toBe(validScholarship.organization);
    expect(savedScholarship.amount).toBe(validScholarship.amount);
    expect(savedScholarship.deadline).toEqual(validScholarship.deadline);
    expect(savedScholarship.eligibility).toEqual(validScholarship.eligibility);
    expect(savedScholarship.requirements).toEqual(
      validScholarship.requirements
    );
    expect(savedScholarship.field_of_study).toEqual(
      validScholarship.field_of_study
    );
    expect(savedScholarship.degree_level).toEqual(
      validScholarship.degree_level
    );
    expect(savedScholarship.country).toBe(validScholarship.country);
    expect(savedScholarship.link).toBe(validScholarship.link);
    expect(savedScholarship.status).toBe(validScholarship.status);
    expect(savedScholarship.createdAt).toBeDefined();
    expect(savedScholarship.updatedAt).toBeDefined();
  });

  it('should fail to save without required fields', async () => {
    const scholarshipWithoutRequired = new ScholarshipModel({
      title: 'Incomplete Scholarship',
    });

    let err: mongoose.Error.ValidationError | null = null;
    try {
      await scholarshipWithoutRequired.save();
    } catch (error) {
      if (error instanceof mongoose.Error.ValidationError) {
        err = error;
      }
    }

    expect(err).toBeDefined();
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
  });

  it('should validate array field minimum length requirements', async () => {
    const scholarshipWithEmptyArrays = new ScholarshipModel({
      title: 'Test Scholarship',
      organization: 'Test University',
      amount: '$5,000',
      deadline: new Date(),
      eligibility: [], // Should have at least one item
      requirements: [], // Should have at least one item
      field_of_study: [], // Should have at least one item
      degree_level: [], // Should have at least one item
      country: 'Test Country',
      link: 'https://test.edu',
      status: 'active',
    });

    let err: mongoose.Error.ValidationError | null = null;
    try {
      await scholarshipWithEmptyArrays.save();
    } catch (error) {
      if (error instanceof mongoose.Error.ValidationError) {
        err = error;
      }
    }

    expect(err).toBeDefined();
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err?.errors.eligibility).toBeDefined();
    expect(err?.errors.requirements).toBeDefined();
    expect(err?.errors.field_of_study).toBeDefined();
    expect(err?.errors.degree_level).toBeDefined();
  });

  it('should validate status enum values', async () => {
    const scholarshipWithInvalidStatus = new ScholarshipModel({
      title: 'Test Scholarship',
      organization: 'Test University',
      amount: '$5,000',
      deadline: new Date(),
      eligibility: ['Test'],
      requirements: ['Test'],
      field_of_study: ['Test'],
      degree_level: ['Test'],
      country: 'Test Country',
      link: 'https://test.edu',
      status: 'invalid-status', // Invalid enum value
    });

    let err: mongoose.Error.ValidationError | null = null;
    try {
      await scholarshipWithInvalidStatus.save();
    } catch (error) {
      if (error instanceof mongoose.Error.ValidationError) {
        err = error;
      }
    }

    expect(err).toBeDefined();
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err?.errors.status).toBeDefined();
  });

  it('should store and retrieve additional info correctly', async () => {
    const scholarshipWithAdditionalInfo = {
      title: 'Test Scholarship',
      organization: 'Test University',
      amount: '$5,000',
      deadline: new Date(),
      eligibility: ['Test'],
      requirements: ['Test'],
      field_of_study: ['Test'],
      degree_level: ['Test'],
      country: 'Test Country',
      link: 'https://test.edu',
      status: 'active',
      additional_info: {
        fundingSource: 'Private',
        renewalPossible: true,
        contactPerson: 'John Doe',
      },
    };

    const scholarship = new ScholarshipModel(scholarshipWithAdditionalInfo);
    const saved = await scholarship.save();
    const retrieved = await ScholarshipModel.findById(saved._id);

    // Use type assertion since we know additional_info exists
    const additionalInfo = retrieved?.additional_info as Map<string, any>;
    expect(additionalInfo.get('fundingSource')).toBe('Private');
    expect(additionalInfo.get('renewalPossible')).toBe(true);
    expect(additionalInfo.get('contactPerson')).toBe('John Doe');
  });
});
