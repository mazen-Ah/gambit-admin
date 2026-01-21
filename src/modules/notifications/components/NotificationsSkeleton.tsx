import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

export default function NotificationsSkeleton({insideHeader, noHeader}: {insideHeader?: boolean, noHeader?: boolean}) {
  return (
    <div className={`page_container ${insideHeader ? "skeleton_w-100" : ""}`}>
      <div className="page_content">
        <SkeletonTheme baseColor="#d4d4d4" highlightColor="#e9e9e9">
          <div className={`${insideHeader ? "skeleton_padding" : ""}`}>
            {!insideHeader && !noHeader && (
              <div className="skeleton_flex s-b skeleton_mb-big">
                <div className="skeleton_flex skeleton_w-fit j-c">
                  <Skeleton className="skeleton_button skeleton_no-margin small" />
                  <Skeleton className="skeleton_button skeleton_no-margin small" />
                  <Skeleton className="skeleton_button skeleton_no-margin small" />
                </div>
                <div className="skeleton_w-fit">
                  <Skeleton className="skeleton_title skeleton_no-margin small" />
                </div>
              </div>
            )}
            {!insideHeader && (
              <Skeleton className="skeleton_title small" />
            )}
            <Skeleton className="skeleton_box" />
            <Skeleton className="skeleton_box" />
            <Skeleton className="skeleton_box" />
            <Skeleton className="skeleton_box" />
            <Skeleton className="skeleton_box skeleton_mb-big" />
            {!insideHeader && (
              <Skeleton className="skeleton_title small" />
            )}
            <Skeleton className="skeleton_box" />
            <Skeleton className="skeleton_box" />
            <Skeleton className="skeleton_box" />
            <Skeleton className="skeleton_box" />
            <Skeleton className="skeleton_box" />
          </div>
        </SkeletonTheme>
      </div>
    </div>
  );
}
