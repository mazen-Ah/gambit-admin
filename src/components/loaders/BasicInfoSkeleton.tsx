import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

export default function BasicInfoSkeleton() {
  return (
    <div className="basic-info-skeleton">
      <SkeletonTheme baseColor="#d4d4d4" highlightColor="#e9e9e9">
          <div className=" skeleton_w-100">
            <div className="skeleton_flex">
              <div className="skeleton_w-100">
                <Skeleton className="skeleton_image skeleton_w-100" />
              </div>
              <div className="skeleton_w-100">
                <Skeleton className="skeleton_image skeleton_w-100" />
              </div>
              <div className="skeleton_w-100">
                <Skeleton className="skeleton_image skeleton_w-100" />
              </div>
              <div className="skeleton_w-100">
                <Skeleton className="skeleton_image skeleton_w-100" />
              </div>
            </div>
          </div>
      </SkeletonTheme>
    </div>
  );
}
