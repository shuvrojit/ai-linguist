import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { JobDescriptionModel } from '../../models';

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('JobDescription Model Test', () => {
  beforeEach(async () => {
    await JobDescriptionModel.deleteMany({});
  });

  it('should create & save job description successfully', async () => {
    const validJobDescription = {
      company_title: 'Tech Corp',
      job_position: 'Senior Software Engineer',
      job_location: 'San Francisco, CA',
      job_type: 'full time',
      workplace: 'hybrid',
      due_date: new Date('2024-12-31'),
      tech_stack: ['TypeScript', 'React', 'Node.js'],
      responsibilities: [
        'Lead development of core features',
        'Mentor junior developers',
        'Design system architecture',
      ],
      professional_experience: 5,
      requirements: [
        "Bachelor's in Computer Science",
        '5+ years of experience',
        'Strong problem-solving skills',
      ],
      additional_skills: ['AWS', 'Docker', 'Kubernetes'],
      company_culture:
        'Fast-paced, innovative environment with focus on collaboration',
    };

    const jobDescription = new JobDescriptionModel(validJobDescription);
    const savedJob = await jobDescription.save();

    expect(savedJob._id).toBeDefined();
    expect(savedJob.company_title).toBe(validJobDescription.company_title);
    expect(savedJob.job_position).toBe(validJobDescription.job_position);
    expect(savedJob.job_location).toBe(validJobDescription.job_location);
    expect(savedJob.job_type).toBe(validJobDescription.job_type);
    expect(savedJob.workplace).toBe(validJobDescription.workplace);
    expect(savedJob.due_date).toEqual(validJobDescription.due_date);
    expect(savedJob.tech_stack).toEqual(validJobDescription.tech_stack);
    expect(savedJob.responsibilities).toEqual(
      validJobDescription.responsibilities
    );
    expect(savedJob.professional_experience).toBe(
      validJobDescription.professional_experience
    );
    expect(savedJob.requirements).toEqual(validJobDescription.requirements);
    expect(savedJob.additional_skills).toEqual(
      validJobDescription.additional_skills
    );
    expect(savedJob.company_culture).toBe(validJobDescription.company_culture);
    expect(savedJob.createdAt).toBeDefined();
    expect(savedJob.updatedAt).toBeDefined();
  });

  it('should fail to save without required fields', async () => {
    const jobWithoutRequired = new JobDescriptionModel({
      company_title: 'Test Company',
    });

    let err: mongoose.Error.ValidationError | null = null;
    try {
      await jobWithoutRequired.save();
    } catch (error) {
      if (error instanceof mongoose.Error.ValidationError) {
        err = error;
      }
    }

    expect(err).toBeDefined();
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
  });

  it('should validate job_type enum values', async () => {
    const jobWithInvalidType = new JobDescriptionModel({
      company_title: 'Test Company',
      job_position: 'Test Position',
      job_location: 'Test Location',
      job_type: 'invalid-type', // Invalid enum value
      workplace: 'remote',
      due_date: new Date(),
      tech_stack: ['Test'],
      responsibilities: ['Test'],
      professional_experience: 1,
      requirements: ['Test'],
      company_culture: 'Test Culture',
    });

    let err: mongoose.Error.ValidationError | null = null;
    try {
      await jobWithInvalidType.save();
    } catch (error) {
      if (error instanceof mongoose.Error.ValidationError) {
        err = error;
      }
    }

    expect(err).toBeDefined();
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err?.errors.job_type).toBeDefined();
  });

  it('should validate workplace enum values', async () => {
    const jobWithInvalidWorkplace = new JobDescriptionModel({
      company_title: 'Test Company',
      job_position: 'Test Position',
      job_location: 'Test Location',
      job_type: 'full time',
      workplace: 'invalid-workplace', // Invalid enum value
      due_date: new Date(),
      tech_stack: ['Test'],
      responsibilities: ['Test'],
      professional_experience: 1,
      requirements: ['Test'],
      company_culture: 'Test Culture',
    });

    let err: mongoose.Error.ValidationError | null = null;
    try {
      await jobWithInvalidWorkplace.save();
    } catch (error) {
      if (error instanceof mongoose.Error.ValidationError) {
        err = error;
      }
    }

    expect(err).toBeDefined();
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err?.errors.workplace).toBeDefined();
  });

  it('should validate professional_experience is a number', async () => {
    const jobWithInvalidExperience = new JobDescriptionModel({
      company_title: 'Test Company',
      job_position: 'Test Position',
      job_location: 'Test Location',
      job_type: 'full time',
      workplace: 'remote',
      due_date: new Date(),
      tech_stack: ['Test'],
      responsibilities: ['Test'],
      professional_experience: 'invalid', // Should be a number
      requirements: ['Test'],
      company_culture: 'Test Culture',
    });

    let err: mongoose.Error.ValidationError | null = null;
    try {
      await jobWithInvalidExperience.save();
    } catch (error) {
      if (error instanceof mongoose.Error.ValidationError) {
        err = error;
      }
    }

    expect(err).toBeDefined();
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err?.errors.professional_experience).toBeDefined();
  });

  it('should validate array fields are not empty', async () => {
    const jobWithEmptyArrays = new JobDescriptionModel({
      company_title: 'Test Company',
      job_position: 'Test Position',
      job_location: 'Test Location',
      job_type: 'full time',
      workplace: 'remote',
      due_date: new Date(),
      tech_stack: [], // Should have at least one item
      responsibilities: [], // Should have at least one item
      professional_experience: 1,
      requirements: [], // Should have at least one item
      company_culture: 'Test Culture',
    });

    let err: mongoose.Error.ValidationError | null = null;
    try {
      await jobWithEmptyArrays.save();
    } catch (error) {
      if (error instanceof mongoose.Error.ValidationError) {
        err = error;
      }
    }

    expect(err).toBeDefined();
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err?.errors['tech_stack']).toBeDefined();
    expect(err?.errors['responsibilities']).toBeDefined();
    expect(err?.errors['requirements']).toBeDefined();
  });
});
