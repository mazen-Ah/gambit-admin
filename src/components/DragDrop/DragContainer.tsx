import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import DragPreview from './DragPreview';

interface DragContainerProps {
  children: React.ReactNode;
  previewTypes: string[];
  renderPreview: (item: any, itemType: string) => React.ReactNode;
  className?: string;
}

const DragContainer: React.FC<DragContainerProps> = ({
  children,
  previewTypes,
  renderPreview,
  className
}) => {
  return (
    <DndProvider backend={HTML5Backend}>
      <DragPreview acceptedTypes={previewTypes} renderPreview={renderPreview} />
      <div className={className}>
        {children}
      </div>
    </DndProvider>
  );
};

export default DragContainer;
