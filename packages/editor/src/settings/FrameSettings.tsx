import React, { FC, useMemo } from 'react';
import ColorSettings from './ColorSettings';
import { useEditor } from '../hooks';
import { FrameLayerProps } from '../layers/FrameLayer';
import { GradientStyle } from '@lidojs/core';
import { Layer } from '@lidojs/editor';
import { RootLayerProps } from '../layers/RootLayer';

interface FrameSettingsProps {
    layers: Layer<FrameLayerProps>[];
}
const FrameSettings: FC<FrameSettingsProps> = ({ layers }) => {
    const { actions, activePage } = useEditor((state) => ({
        activePage: state.activePage,
        sidebar: state.sidebar,
    }));
    const colors = useMemo(() => {
        return layers.map((layer) => layer.data.props.color).filter((c): c is string => !!c);
    }, [layers]);
    const gradient = useMemo(() => {
        return layers.map((layer) => layer.data.props.gradientBackground).filter((c) => !!c);
    }, [layers]);
    const updateColor = (color: string) => {
        const layerIds = layers.map((l) => l.id);
        actions.history.throttle(2000).setProp<FrameLayerProps>(activePage, layerIds, {
            color,
            gradientBackground: null,
        });
    };
    const handleChangeGradient = (data: { colors: string[]; style: GradientStyle }) => {
        const layerIds = layers.map((l) => l.id);
        actions.history.throttle(2000).setProp<RootLayerProps>(activePage, layerIds, {
            gradientBackground: data,
            color: null,
        });
    };
    return (
        <ColorSettings
            colors={colors}
            useGradient={true}
            gradient={gradient.length > 0 ? gradient[0] : null}
            onChange={updateColor}
            onChangeGradient={handleChangeGradient}
        />
    );
};

export default FrameSettings;
