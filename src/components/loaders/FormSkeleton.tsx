import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

export default function FormSkeleton({ offer, noImage, role }: any) {
  return (
    offer ?
      <div>
        < SkeletonTheme baseColor="#d4d4d4" highlightColor="#e9e9e9" >
          <div className="skeleton_flex">
            <div className="skeleton skeleton_w-100">
              <Skeleton className="skeleton_title" />
              <div className="skeleton_flex">
                <div className="skeleton_w-100">
                  <Skeleton className="skeleton_input-title" />
                  <Skeleton className="skeleton_input skeleton_w-100" />
                </div>
                <div className="skeleton_w-100">
                </div>
              </div>
              {!role &&
                <>
                  <Skeleton className="skeleton_title" />
                  <div className="skeleton_flex">
                    <div className="skeleton_w-100">
                      <Skeleton className="skeleton_input-title" />
                      <Skeleton className="skeleton_input skeleton_w-100" />
                    </div>
                    <div className="skeleton_w-100">
                    </div>
                  </div>
                </>
              }
              <Skeleton className="skeleton_title" />
              <div className="skeleton_flex">
                <div className="skeleton_w-100">
                  <Skeleton className="skeleton_input-title" />
                  <Skeleton className="skeleton_input skeleton_w-100" />
                </div>
                <div className="skeleton_w-100">
                  <Skeleton className="skeleton_input-title" />
                  <Skeleton className="skeleton_input skeleton_w-100" />
                </div>
                <div className="skeleton_w-100">
                  <Skeleton className="skeleton_input-title" />
                  <Skeleton className="skeleton_input skeleton_w-100" />
                </div>
                <div className="skeleton_w-100">
                  <Skeleton className="skeleton_input-title" />
                  <Skeleton className="skeleton_input skeleton_w-100" />
                </div>

              </div>
              {role &&
                <>
                  <div className="skeleton_flex">
                    <div className="skeleton_w-100">
                      <Skeleton className="skeleton_input-title" />
                      <Skeleton className="skeleton_input skeleton_w-100" />
                    </div>
                    <div className="skeleton_w-100">
                      <Skeleton className="skeleton_input-title" />
                      <Skeleton className="skeleton_input skeleton_w-100" />
                    </div>
                    <div className="skeleton_w-100">
                      <Skeleton className="skeleton_input-title" />
                      <Skeleton className="skeleton_input skeleton_w-100" />
                    </div>
                    <div className="skeleton_w-100">
                      <Skeleton className="skeleton_input-title" />
                      <Skeleton className="skeleton_input skeleton_w-100" />
                    </div>

                  </div>
                  <div className="skeleton_flex">
                    <div className="skeleton_w-100">
                      <Skeleton className="skeleton_input-title" />
                      <Skeleton className="skeleton_input skeleton_w-100" />
                    </div>
                    <div className="skeleton_w-100">
                      <Skeleton className="skeleton_input-title" />
                      <Skeleton className="skeleton_input skeleton_w-100" />
                    </div>
                    <div className="skeleton_w-100">
                      <Skeleton className="skeleton_input-title" />
                      <Skeleton className="skeleton_input skeleton_w-100" />
                    </div>
                    <div className="skeleton_w-100">
                      <Skeleton className="skeleton_input-title" />
                      <Skeleton className="skeleton_input skeleton_w-100" />
                    </div>

                  </div>
                </>
              }
            </div>
          </div>
        </SkeletonTheme >
      </div >
      :
      <div style={{width: "100%"}}>
        <SkeletonTheme baseColor="#d4d4d4" highlightColor="#e9e9e9">
          <div className="skeleton_flex">
            <div className="skeleton skeleton_w-100">
              {!noImage && <div className="skeleton_flex">
                <div className="skeleton_w-100">
                  <Skeleton className="skeleton_input-title" />
                  <Skeleton className="skeleton_image skeleton_w-100" />
                </div>
                <div className="skeleton_w-100">
                </div>
              </div>}

              <Skeleton className="skeleton_title" />
              <div className="skeleton_flex">
                <div className="skeleton_w-100">
                  <Skeleton className="skeleton_input-title" />
                  <Skeleton className="skeleton_input skeleton_w-100" />
                </div>
                <div className="skeleton_w-100">
                  <Skeleton className="skeleton_input-title" />
                  <Skeleton className="skeleton_input skeleton_w-100" />
                </div>
              </div>
              <Skeleton className="skeleton_title" />
              <div className="skeleton_flex">
                <div className="skeleton_w-100">
                  <Skeleton className="skeleton_input-title" />
                  <Skeleton className="skeleton_input skeleton_w-100" />
                </div>
                <div className="skeleton_w-100">
                  <Skeleton className="skeleton_input-title" />
                  <Skeleton className="skeleton_input skeleton_w-100" />
                </div>
              </div>
              <Skeleton className="skeleton_title" />
              <div className="skeleton_flex">
                <div className="skeleton_w-100">
                  <Skeleton className="skeleton_input-title" />
                  <Skeleton className="skeleton_input skeleton_w-100" />
                </div>
                <div className="skeleton_w-100">
                  <Skeleton className="skeleton_input-title" />
                  <Skeleton className="skeleton_input skeleton_w-100" />
                </div>
              </div>
            </div>
          </div>
        </SkeletonTheme>
      </div>

  );
}
