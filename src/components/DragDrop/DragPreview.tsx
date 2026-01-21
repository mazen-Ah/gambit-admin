import React from 'react';
import { useDragLayer } from 'react-dnd';

const layerStyles: React.CSSProperties = {
  position: 'fixed',
  pointerEvents: 'none',
  zIndex: 100,
  left: 0,
  top: 0,
  width: '100%',
  height: '100%',
};

function getItemStyles(initialOffset: any, currentOffset: any, width?: number) {
  if (!initialOffset || !currentOffset) {
    return {
      display: 'none',
    };
  }

  const { x, y } = currentOffset;

  const transform = `translate(${x}px, ${y}px)`;
  return {
    transform,
    WebkitTransform: transform,
    width: width ? `${width}px` : 'auto',
  };
}

interface DragPreviewProps {
  acceptedTypes: string[];
  renderPreview: (item: any, itemType: string) => React.ReactNode;
}

const DragPreview: React.FC<DragPreviewProps> = ({ acceptedTypes, renderPreview }) => {
  const { itemType, isDragging, item, initialOffset, currentOffset } = useDragLayer(
    (monitor) => ({
      item: monitor.getItem(),
      itemType: monitor.getItemType(),
      initialOffset: monitor.getInitialSourceClientOffset(),
      currentOffset: monitor.getSourceClientOffset(),
      isDragging: monitor.isDragging(),
    })
  );

  if (!isDragging || !itemType || !acceptedTypes.includes(itemType as string)) {
    return null;
  }

  return (
    <div style={layerStyles}>
      <div style={getItemStyles(initialOffset, currentOffset, item?.headerWidth)}>
        {renderPreview(item, itemType as string)}
      </div>
    </div>
  );
};

export default DragPreview;
