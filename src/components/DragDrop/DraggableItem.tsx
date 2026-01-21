import React, { useRef, useEffect } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';

interface DraggableItemProps {
  id: string | number;
  index: number;
  type: string;
  data?: any;
  onMove: (fromIndex: number, toIndex: number) => void;
  onDragStart?: () => void;
  children: (dragRef: any, isDragging: boolean) => React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const DraggableItem: React.FC<DraggableItemProps> = ({
  id,
  index,
  type,
  data,
  onMove,
  onDragStart,
  children,
  className,
  style
}) => {
  const headerRef = useRef<HTMLDivElement>(null);
  const lastMoveTime = useRef<number>(0);

  const [{ isDragging }, drag, preview] = useDrag(() => ({
    type,
    item: () => {
      // Call onDragStart callback if provided
      onDragStart?.();
      
      // Get header width for preview
      const headerWidth = headerRef.current?.offsetWidth || 0;
      
      return {
        id,
        index,
        headerWidth,
        ...data
      };
    },
    collect: (monitor) => {
      const item = monitor.getItem();
      return { 
        isDragging: monitor.isDragging() && item?.id === id
      };
    }
  }), [id, index, data, onDragStart]);

  const [, drop] = useDrop(() => ({
    accept: type,
    hover: (item: any, monitor) => {
      if (!headerRef.current) {
        return;
      }

      const dragIndex = item.index;
      const hoverIndex = index;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      // Determine rectangle on screen
      const hoverBoundingRect = headerRef.current.getBoundingClientRect();

      // Get item height and create smaller buffer zones for more responsive switching
      const hoverHeight = hoverBoundingRect.bottom - hoverBoundingRect.top;
      const bufferZone = Math.min(hoverHeight * 0.05, 4); // 5% of height or max 4px (even smaller)
      
      // Determine mouse position
      const clientOffset = monitor.getClientOffset();
      if (!clientOffset) {
        return;
      }

      // Get pixels to the top
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;
      const hoverMiddleY = hoverHeight / 2;

      // More responsive boundaries - switch when crossing closer to the center
      
      // Dragging downwards - switch when in upper 40% of the item
      if (dragIndex < hoverIndex && hoverClientY < (hoverMiddleY - bufferZone)) {
        return;
      }

      // Dragging upwards - switch when in lower 40% of the item  
      if (dragIndex > hoverIndex && hoverClientY > (hoverMiddleY + bufferZone)) {
        return;
      }

      // Light debounce to prevent excessive calls while maintaining responsiveness
      const now = Date.now();
      if (now - lastMoveTime.current < 5) { // ~200fps limit - even more responsive
        return;
      }
      lastMoveTime.current = now;

      // Time to actually perform the action
      onMove(dragIndex, hoverIndex);

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    }
  }), [index, onMove]);

  // Use empty drag preview to hide the default preview
  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, [preview]);

  return (
    <div 
      ref={drop} 
      className={className}
      style={{ 
        opacity: isDragging ? 0.5 : 1,
        ...style 
      }}
    >
      <div ref={headerRef}>
        {children(drag, isDragging)}
      </div>
    </div>
  );
};

export default DraggableItem;
