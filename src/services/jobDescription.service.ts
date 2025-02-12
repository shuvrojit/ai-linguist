import { JobDescriptionModel } from '../models';
import type { IJobDescription } from '../models/jobDescription.model';
import { Types } from 'mongoose';

export const createJob = async (jobData: IJobDescription) => {
  return JobDescriptionModel.create(jobData);
};

export const getAllJobs = async () => {
  return JobDescriptionModel.find<IJobDescription>({});
};

export const getJobById = async (id: string) => {
  return JobDescriptionModel.findById<IJobDescription>(new Types.ObjectId(id));
};

export const updateJob = async (
  id: string,
  updateData: Partial<IJobDescription>
) => {
  return JobDescriptionModel.findByIdAndUpdate<IJobDescription>(
    new Types.ObjectId(id),
    updateData,
    { new: true }
  );
};

export const deleteJob = async (id: string) => {
  return JobDescriptionModel.findByIdAndDelete<IJobDescription>(
    new Types.ObjectId(id)
  );
};

export const searchJobs = async (query: string) => {
  return JobDescriptionModel.find<IJobDescription>({
    $or: [
      { company_title: { $regex: query, $options: 'i' } },
      { job_position: { $regex: query, $options: 'i' } },
      { job_location: { $regex: query, $options: 'i' } },
      { tech_stack: { $in: [new RegExp(query, 'i')] } },
    ],
  });
};
