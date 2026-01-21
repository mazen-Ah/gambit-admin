import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import SectionHeader from '../SectionHeader';

export default function FormDynamicSkeleton({
  sections,
  buttons,
  noTitle
}: {
  sections: { columns: number; items: number; type?: 'input' | 'textarea' | 'image' | 'switch' }[][];
  buttons: number;
  noTitle?: boolean;
}) {
  return (
    <div className="skeleton" style={{ width: '100%' }}>
      <SkeletonTheme baseColor="#d4d4d4" highlightColor="#e9e9e9">
        {sections.map((section, index) => (
          <SectionHeader title={noTitle ? '' : <Skeleton className="skeleton_input-title" />} customStyle={`skeleton_w-100 ${index === sections.length - 1 ? 'last' : ''}`}>
            {section.map((row, index) => (
              <div className="skeleton_flex" key={`skeleton-inputs-${index}`}>
                {Array(row.columns)
                  .fill(0)
                  ?.map((_, index) => {
                    if (index >= row.items) return <div className="skeleton_w-100"></div>;
                    return (
                      <div className={`skeleton_w-100`}>
                        {row.type !== 'switch' && <Skeleton className="skeleton_input-title small" />}
                        <Skeleton className={`skeleton_input skeleton_w-100 ${row.type}`} />
                      </div>
                    );
                  })}
              </div>
            ))}
          </SectionHeader>
        ))}
        {buttons && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: "1rem" }}>
            {Array(buttons)
              .fill(0)
              ?.map(() => <Skeleton className={`skeleton_button`} />)}
          </div>
        )}
      </SkeletonTheme>
    </div>
  );
}
