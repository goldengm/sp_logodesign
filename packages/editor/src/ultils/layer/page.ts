import { serializeLayers } from './layers';
import { Page } from '../../types';
import { SerializedPage } from '@lidojs/core';

export const serialize = (pages: Page[]): SerializedPage[] => {
    return pages.map((page) => {
        return {
            locked: page.locked,
            layers: serializeLayers(page.layers, 'ROOT'),
        };
    });
};

