import { Request, Response } from 'express';
import { featuresService } from '../services';
import axios from 'axios';

// Remove unused imports and interfaces

export const summarize = async (req: Request, res: Response) => {
  try {
    const url: string = req.body?.url;
    console.log(url);
    const { data }: { data: string } = await axios.get(
      `https://r.jina.ai/${url}`
    );
    console.log(data);
    const summary = await featuresService.getSummary(data);

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
    const summary = await featuresService.detailOverview(data);
    res.status(200).json(summary);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

export const extractText = async (req: Request, res: Response) => {
  try {
    const text: string = req.body?.content.text;
    const result = await featuresService.extractMeaningfullText(text);
    res.status(200).json(result);
  } catch (err) {
    console.error('Error in extractText:', err);
    res.status(500).json({ error: err });
  }
};
