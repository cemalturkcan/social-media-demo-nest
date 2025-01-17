import { Injectable } from '@nestjs/common';
import * as sharp from 'sharp';
import * as ort from 'onnxruntime-node';
import { createCanvas, loadImage } from 'canvas';
import fs from 'fs';
import { join } from 'path';

@Injectable()
export class DescribeService {
  async detectObjectsOnImage(buf: Buffer): Promise<string[]> {
    try {
      const [input] = await this.prepareInput(buf);
      const output = await this.runModel(input);
      return this.processOutput(output);
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async drawBoundingBoxes(imagePath: string, boxes: any[][]): Promise<void> {
    const image = await loadImage(imagePath);
    const canvas = createCanvas(image.width, image.height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(image, 0, 0);

    ctx.strokeStyle = '#00FF00';
    ctx.lineWidth = 3;
    ctx.font = '50px serif';

    boxes.forEach(([x1, y1, x2, y2, label]) => {
      ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);
      ctx.fillStyle = '#00FF00';
      const width = ctx.measureText(label).width;
      ctx.fillRect(x1, y1, width + 10, 25);
      ctx.fillStyle = '#000000';
      ctx.fillText(label, x1, y1 + 18);
    });

    let out: fs.WriteStream;
    if (imagePath.toLowerCase().endsWith('.png')) {
      out = fs.createWriteStream(join(process.cwd(), 'processed', 'image.png'));
      const stream = canvas.createPNGStream();
      stream.pipe(out);
    } else {
      out = fs.createWriteStream(join(process.cwd(), 'processed', 'image.jpg'));
      const stream = canvas.createJPEGStream();
      stream.pipe(out);
    }
  }

  private async prepareInput(buf: Buffer): Promise<[number[], number, number]> {
    const img = sharp(buf);
    const md = await img.metadata();
    const [imgWidth, imgHeight] = [md.width, md.height];
    const pixels = await img
      .removeAlpha()
      .resize({ width: 640, height: 640, fit: 'fill' })
      .raw()
      .toBuffer();

    const red: number[] = [];
    const green: number[] = [];
    const blue: number[] = [];

    for (let index = 0; index < pixels.length; index += 3) {
      red.push(pixels[index] / 255.0);
      green.push(pixels[index + 1] / 255.0);
      blue.push(pixels[index + 2] / 255.0);
    }

    const input = [...red, ...green, ...blue];
    return [input, imgWidth, imgHeight];
  }

  private async runModel(input: number[]): Promise<Float32Array> {
    const modelPath = join(process.cwd(), 'fs', 'yolo', 'yolov8s.onnx');
    const model = await ort.InferenceSession.create(modelPath);
    const inputTensor = new ort.Tensor(
      Float32Array.from(input),
      [1, 3, 640, 640],
    );
    const outputs = await model.run({ images: inputTensor });
    return outputs['output0'].data;
  }

  private processOutput(output: Float32Array): string[] {
    const labels: string[] = [];

    for (let index = 0; index < 8400; index++) {
      const [classId, prob] = [...Array(80).keys()]
        .map((col) => [col, output[8400 * (col + 4) + index]])
        .reduce((accum, item) => (item[1] > accum[1] ? item : accum), [0, 0]);

      if (prob < 0.5) {
        continue;
      }

      const label = yoloClasses[classId];
      labels.push(label);
    }

    return labels;
  }
}

const yoloClasses = [
  'person',
  'bicycle',
  'car',
  'motorcycle',
  'airplane',
  'bus',
  'train',
  'truck',
  'boat',
  'traffic light',
  'fire hydrant',
  'stop sign',
  'parking meter',
  'bench',
  'bird',
  'cat',
  'dog',
  'horse',
  'sheep',
  'cow',
  'elephant',
  'bear',
  'zebra',
  'giraffe',
  'backpack',
  'umbrella',
  'handbag',
  'tie',
  'suitcase',
  'frisbee',
  'skis',
  'snowboard',
  'sports ball',
  'kite',
  'baseball bat',
  'baseball glove',
  'skateboard',
  'surfboard',
  'tennis racket',
  'bottle',
  'wine glass',
  'cup',
  'fork',
  'knife',
  'spoon',
  'bowl',
  'banana',
  'apple',
  'sandwich',
  'orange',
  'broccoli',
  'carrot',
  'hot dog',
  'pizza',
  'donut',
  'cake',
  'chair',
  'couch',
  'potted plant',
  'bed',
  'dining table',
  'toilet',
  'tv',
  'laptop',
  'mouse',
  'remote',
  'keyboard',
  'cell phone',
  'microwave',
  'oven',
  'toaster',
  'sink',
  'refrigerator',
  'book',
  'clock',
  'vase',
  'scissors',
  'teddy bear',
  'hair drier',
  'toothbrush',
];
