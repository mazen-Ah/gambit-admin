import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';

export default function CheckboxesSkeleton({ columns, rows, withoutTitles }: { columns: number; rows: number; withoutTitles: boolean }) {
  return (
    <div className="skeleton">
      <SkeletonTheme baseColor="#d4d4d4" highlightColor="#e9e9e9">
        <div className="skeleton_w-100">
          {!withoutTitles && <Skeleton className="skeleton_input-title mb-2" />}
          {Array(rows)
            .fill(0)
            ?.map((_, rowIndex) => (
              <div className="skeleton_flex">
                {Array(columns)
                  .fill(0)
                  ?.map(() => (
                    <div className="skeleton_w-100">
                      <Skeleton className={`skeleton_checkbox skeleton_w-100 ${rowIndex === rows - 1 ? 'no-margin' : ''}`} />
                    </div>
                  ))}
              </div>
            ))}
        </div>
      </SkeletonTheme>
    </div>
  );
}