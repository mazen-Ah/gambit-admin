import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';

export default function InputSkeleton({ noHeader, noPadding, gridSize = 12 }: { noHeader?: boolean, noPadding?: boolean, gridSize?: number }) {
  return (
    <SkeletonTheme baseColor="#d4d4d4" highlightColor="#e9e9e9">
      <div className={`skeleton_w-100 grid-${gridSize} grid-mobile-12`} style={{flex: "1 1"}}>
        <div className={`skeleton_flex`}>
          <div className="skeleton_flex">
            <div className="skeleton_w-100">
              {!noHeader && <Skeleton className="skeleton_input-title" />}
              <Skeleton className={`skeleton_input skeleton_w-100 ${noPadding ? 'no-padding' : ''}`} />
            </div>
          </div>
        </div>
      </div>
    </SkeletonTheme>
  );
}