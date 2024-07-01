import { RGBAColor } from '../types';
import { hex2rgb } from '../hex2rgb';
export const hexColorRegex = /^#[0-9A-F]{3,6}[0-9a-f]{0,2}$/i;
export const parseHex = (color: string): RGBAColor => {
    return hex2rgb(color);
};
