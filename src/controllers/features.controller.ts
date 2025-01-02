import { Request, Response } from 'express';
import { detailOverview, getSummary } from '../services/features.service';
import axios from 'axios';

export const summarize = async (req: Request, res: Response) => {
  try {
    const url: string = req.body?.url;
    const { data }: { data: string } = await axios.get(
      `https://r.jina.ai/${url}`
    );
    const summary = await getSummary(data);
    res.status(200).json(summary);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

export const overview = async (req: Request, res: Response) => {
  try {
    const url: string = req.body?.url;
    const { data }: { data: string } = await axios.get(
      `https://r.jina.ai/${url}`
    );
    const summary = await detailOverview(data);
    res.status(200).json(summary);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};
