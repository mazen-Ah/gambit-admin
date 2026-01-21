# Drag & Drop Components

A set of reusable React components for implementing drag and drop functionality using react-dnd.

## Components

### DragContainer
A wrapper component that provides drag and drop context and custom preview rendering.

```tsx
import { DragContainer } from './components/DragDrop';

<DragContainer
  previewTypes={['MY_ITEM_TYPE']}
  renderPreview={(item, itemType) => <MyCustomPreview item={item} />}
  className="my-container"
>
  {/* Your draggable items here */}
</DragContainer>
```

**Props:**
- `previewTypes: string[]` - Array of drag types that should show custom previews
- `renderPreview: (item: any, itemType: string) => React.ReactNode` - Function to render custom preview
- `className?: string` - Optional CSS class for the container

### DraggableItem
A wrapper component that makes any content draggable and droppable.

```tsx
import { DraggableItem } from './components/DragDrop';

<DraggableItem
  id="unique-id"
  index={0}
  type="MY_ITEM_TYPE"
  data={{ name: 'My Item' }}
  onMove={(fromIndex, toIndex) => handleMove(fromIndex, toIndex)}
  onDragStart={() => console.log('Drag started')}
>
  {(dragRef, isDragging) => (
    <div ref={dragRef} style={{ opacity: isDragging ? 0.5 : 1 }}>
      My draggable content
    </div>
  )}
</DraggableItem>
```

**Props:**
- `id: string | number` - Unique identifier for the item
- `index: number` - Current position index of the item
- `type: string` - Drag type identifier
- `data?: any` - Additional data to pass to the drag item
- `onMove: (fromIndex: number, toIndex: number) => void` - Callback when item is moved
- `onDragStart?: () => void` - Optional callback when drag starts
- `children: (dragRef: any, isDragging: boolean) => React.ReactNode` - Render prop for the draggable content
- `className?: string` - Optional CSS class
- `style?: React.CSSProperties` - Optional inline styles

### DragPreview
A generic drag preview component that can render custom previews for different item types.

```tsx
import { DragPreview } from './components/DragDrop';

<DragPreview
  acceptedTypes={['MY_ITEM_TYPE']}
  renderPreview={(item, itemType) => (
    <div className="my-preview">
      {item.name}
    </div>
  )}
/>
```

**Props:**
- `acceptedTypes: string[]` - Array of drag types to show previews for
- `renderPreview: (item: any, itemType: string) => React.ReactNode` - Function to render the preview

## Hooks

### useDragAndDrop
A custom hook for managing drag and drop state and operations.

```tsx
import { useDragAndDrop } from './hooks/useDragAndDrop';

const { items, moveItem, handleDragStart } = useDragAndDrop({
  items: myItems,
  onReorder: (newItems) => setMyItems(newItems),
  onDragStart: () => console.log('Drag started')
});
```

**Parameters:**
- `items: T[]` - Array of items to manage
- `onReorder?: (items: T[]) => void` - Callback when items are reordered
- `onDragStart?: () => void` - Callback when drag starts

**Returns:**
- `items: T[]` - Current items array
- `moveItem: (fromIndex: number, toIndex: number) => void` - Function to move items
- `handleDragStart: () => void` - Function to call when drag starts

## Example Usage

Here's a complete example of how to use the drag and drop components:

```tsx
import React, { useState } from 'react';
import { DragContainer, DraggableItem } from './components/DragDrop';

const MyDraggableList = () => {
  const [items, setItems] = useState([
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' },
    { id: 3, name: 'Item 3' }
  ]);

  const moveItem = (fromIndex: number, toIndex: number) => {
    const newItems = [...items];
    const [movedItem] = newItems.splice(fromIndex, 1);
    newItems.splice(toIndex, 0, movedItem);
    setItems(newItems);
  };

  return (
    <DragContainer
      previewTypes={['LIST_ITEM']}
      renderPreview={(item) => (
        <div style={{ padding: '8px', background: '#f0f0f0', borderRadius: '4px' }}>
          {item.name}
        </div>
      )}
      className="my-list"
    >
      {items.map((item, index) => (
        <DraggableItem
          key={item.id}
          id={item.id}
          index={index}
          type="LIST_ITEM"
          data={item}
          onMove={moveItem}
        >
          {(dragRef, isDragging) => (
            <div
              ref={dragRef}
              style={{
                padding: '12px',
                margin: '4px 0',
                background: isDragging ? '#e0e0e0' : '#fff',
                border: '1px solid #ccc',
                borderRadius: '4px',
                cursor: 'move'
              }}
            >
              {item.name}
            </div>
          )}
        </DraggableItem>
      ))}
    </DragContainer>
  );
};
```

## Features

- ✅ **Reusable**: Components can be used across different parts of your application
- ✅ **Type Safe**: Full TypeScript support with proper typing
- ✅ **Customizable**: Custom preview rendering and styling options
- ✅ **Performance**: Uses empty drag images to prevent default browser previews
- ✅ **Flexible**: Supports any data structure and drag types
- ✅ **Clean API**: Simple, intuitive component interface
