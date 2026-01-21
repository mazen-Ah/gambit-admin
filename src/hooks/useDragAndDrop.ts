import React, { useState, useCallback } from 'react';

interface UseDragAndDropProps<T> {
  items: T[];
  onReorder?: (items: T[]) => void;
  onDragStart?: () => void;
}

interface UseDragAndDropReturn<T> {
  items: T[];
  moveItem: (fromIndex: number, toIndex: number) => void;
  handleDragStart: () => void;
}

export function useDragAndDrop<T>({
  items: initialItems,
  onReorder,
  onDragStart
}: UseDragAndDropProps<T>): UseDragAndDropReturn<T> {
  const [items, setItems] = useState<T[]>(initialItems);

  const moveItem = useCallback((fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return;
    
    setItems(currentItems => {
      const newItems = [...currentItems];
      const [movedItem] = newItems.splice(fromIndex, 1);
      newItems.splice(toIndex, 0, movedItem);
      
      // Call onReorder callback if provided
      onReorder?.(newItems);
      
      return newItems;
    });
  }, [onReorder]);

  const handleDragStart = useCallback(() => {
    onDragStart?.();
  }, [onDragStart]);

  // Update items when initialItems change
  React.useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  return {
    items,
    moveItem,
    handleDragStart
  };
}
