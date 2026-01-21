import { ReactNode, useCallback } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useField } from 'formik';

const ItemType = 'TABLE_ITEM';

const DraggableTable = (props: any) => {
  return (
    <DndProvider backend={HTML5Backend}>
      <DraggableTableContent {...props} />
    </DndProvider>
  );
};

const DraggableTableContent = ({ tableHeaders, name, noData, children }: any) => {
  const [field, , helpers] = useField({ name: name });

  const moveRow = (fromIndex: number, toIndex: number) => {
    const updatedList = [...field.value];
    const [movedRow] = updatedList.splice(fromIndex, 1);
    updatedList.splice(toIndex, 0, movedRow);
    helpers.setValue(updatedList as any);
  };

  const findRow = useCallback(
    (item: any) => {
      const currFile = field.value?.find((ele: any) => ele.id === item.id);
      return {
        item,
        index: field?.value?.indexOf(currFile)
      };
    },
    [field?.value]
  );

  return (
    <div className={`table_container lessColumns hasPagination`}>
      <div className="table_header">
        {tableHeaders?.map((header: any, index: number) => (
          <span className={`head ${header.customClass}`} key={index}>
            {header.label}
          </span>
        ))}
      </div>
      <div className={`table_data ${noData && 'no_data'}`}>{children(moveRow, findRow)}</div>
    </div>
  );
};

export default DraggableTable;

export const DraggableTableItem = ({ item, children, findRow, moveRow }: { item: any; children: ReactNode; index: number; findRow: any; moveRow: any }) => {
  const originalIndex = findRow(item).index;
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: ItemType,
      item: { item, originalIndex },
      collect: (monitor) => ({
        isDragging: monitor.isDragging()
      }),
      end: (item, monitor) => {
        const { item: droppedFile, originalIndex } = item;
        const didDrop = monitor.didDrop();
        if (!didDrop) {
          const currIndex = findRow(droppedFile).index;
          moveRow(currIndex, originalIndex);
        }
      }
    }),
    [item, originalIndex, moveRow]
  );

  const [, drop] = useDrop(
    () => ({
      accept: ItemType,
      hover: (row: any) => {
        if (row?.item?.id !== item?.id) {
          const { index: overIndex } = findRow(item);
          const { index: fromIndex } = findRow(row?.item);
          moveRow(fromIndex, overIndex);
        }
      }
    }),
    [findRow, moveRow]
  );

  return (
    <div
      ref={(node) => drag(drop(node))}
      key={item.id}
      className={`item clickable has_logo vehicle_makes ${isDragging ? 'dragging' : ''}`}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      {children}
    </div>
  );
};
