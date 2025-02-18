import { Router, Request, Response } from 'express';
import { jobDescriptionService } from '../../services';

const router = Router();

router.get('/', async (_req: Request, res: Response) => {
  try {
    const jobs = await jobDescriptionService.getAllJobs();
    res.status(200).json(jobs);
  } catch (err) {
    const error = err as Error;
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const job = await jobDescriptionService.getJobById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.status(200).json(job);
  } catch (err) {
    const error = err as Error;
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', async (req: Request, res: Response) => {
  try {
    const updatedJob = await jobDescriptionService.updateJob(
      req.params.id,
      req.body
    );
    if (!updatedJob) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.status(200).json(updatedJob);
  } catch (err) {
    const error = err as Error;
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const deletedJob = await jobDescriptionService.deleteJob(req.params.id);
    if (!deletedJob) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.status(200).json({ message: 'Job deleted successfully' });
  } catch (err) {
    const error = err as Error;
    res.status(500).json({ error: error.message });
  }
});

router.get('/search/:query', async (req: Request, res: Response) => {
  try {
    const jobs = await jobDescriptionService.searchJobs(req.params.query);
    res.status(200).json(jobs);
  } catch (err) {
    const error = err as Error;
    res.status(500).json({ error: error.message });
  }
});

export default router;
