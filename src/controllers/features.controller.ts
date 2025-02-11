import { Request, Response } from 'express';
import { featuresService } from '../services';
import axios from 'axios';

export const summarize = async (req: Request, res: Response) => {
  try {
    const url: string = req.body?.url;
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
    const filteredText = await featuresService.extractMeaningfullText(text);
    console.log(filteredText);
    res.status(200).json(filteredText);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};
