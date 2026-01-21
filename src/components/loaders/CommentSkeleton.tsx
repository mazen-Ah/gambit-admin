import React from 'react'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'

export default function CommentSkeleton({count}:{count:number}) {
  return (
    <>
      {[...Array(count)].map((_, index) => (
        <div key={index} className='comment-skeleton'>
          <SkeletonTheme baseColor="#d4d4d4" highlightColor="#e9e9e9">
            <div className="comment-skeleton-header">
              <Skeleton className='skeleton_title'/>
              <Skeleton className='skeleton_title'/>
            </div>
            <div className="comment-skeleton-desc">
              <Skeleton className='skeleton_title' count={1.2} style={{marginBottom:0}}/>
            </div>
          </SkeletonTheme>
        </div>
      ))}
    </>
  );
}

