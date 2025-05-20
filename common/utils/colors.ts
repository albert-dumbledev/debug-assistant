import { LogAnalysis } from '../types/logAnalysis';
import { ColorType } from '../types/styles';

export const severityColors: Record<LogAnalysis['severity'], ColorType> = {
  high: ColorType.RED,
  medium: ColorType.ORANGE,
  low: ColorType.GREEN,
};

export const confidenceColors: Record<LogAnalysis['confidence'], ColorType> = {
  high: ColorType.GREEN,
  medium: ColorType.ORANGE,
  low: ColorType.RED,
  unknown: ColorType.GRAY,
}; 