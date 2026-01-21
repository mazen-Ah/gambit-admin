import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { useMemo } from "react";
import ListHeader from "../ListHeader";
import { ITableSkeleton } from "../../types/Interfaces";

export default function TableSkeleton({
  columns,
  withSelectFilter,
  withoutButton,
  withoutHeader,
  small
}:ITableSkeleton) {

  const columnsElements = useMemo(() => {
    const columnsElements = [];
    for (let i = 0; i < columns; i++) {
      columnsElements.push(
        <span className="head" key={i}>
          <Skeleton className="skeleton_table-text skeleton_no-margin" />
        </span>
      );
    }
    return columnsElements;
  }, [columns]);

  const rowsElements = useMemo(() => {
    const rowsElements = [];
    for (let i = 0; i < 15; i++) {
      const columnsElements = [];
      for (let j = 0; j < columns; j++) {
        columnsElements.push(
          <div className="column" key={j}>
            <Skeleton className="skeleton_table-text skeleton_no-margin" />
          </div>
        );
      }
      rowsElements.push(
        <div className="item" key={`sken-table-${i}`}>
          {columnsElements}
        </div>
      );
    }
    return rowsElements;
  }, [columns]);

  return (
    <div className={`page_container`}>
      <div className="page_content">
        <SkeletonTheme baseColor="#d4d4d4" highlightColor="#e9e9e9">
          {!withoutHeader && (
            <Skeleton className="skeleton_title small" />
          )}
          <div className={`table_container ${small}`}>
            <div className="table_header">{columnsElements}</div>
            <div className={`table_data`}>{rowsElements}</div>
          </div>
        </SkeletonTheme>
      </div>
    </div>
  );
}
