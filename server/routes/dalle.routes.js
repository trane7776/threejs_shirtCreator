import express from 'express';

import * as dotenv from 'dotenv';
import Replicate from 'replicate';
import { reader } from '../../client/src/config/helpers.js';
import axios from 'axios';
import fetch from 'node-fetch';
import fs from 'fs';
dotenv.config();

const router = express.Router();
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

router.route('/').get((req, res) => {
  res.status(200).json({ message: 'Hello World Routes' });
});

router.route('/').post(async (req, res) => {
  try {
    const { prompt } = req.body;
    const model =
      'stability-ai/stable-diffusion:27b93a2413e7f36cd83da926f3656280b2931564ff050bf9575f1fdf9bcd7478';
    const input = {
      prompt,
      width: 384,
      height: 384,
    };
    console.log('1');
    const output = await replicate.run(model, { input });
    console.log('2');
    convertImageToBase64Json(output[0])
      .then((base64Json) => {
        res.status(200).json({ photo: base64Json });
      })
      .catch((error) => {
        console.error(error);
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
});
async function convertImageToBase64Json(url) {
  try {
    console.log('4');
    const response = await fetch(url); // Используйте fetch из node-fetch
    console.log('5');
    const imageBuffer = await response.buffer();
    console.log('6');
    const base64Image = await imageBuffer.toString('base64');
    return base64Image;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to convert image to Base64 JSON');
  }
}
export default router;
