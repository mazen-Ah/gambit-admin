import React, { Fragment } from 'react';
import { deleteIcon, largeDragIcon } from '../../../config/variables';
import ExpandAccordion from '../../../components/ExpandesAccordion';

interface AccordionDragPreviewProps {
  item: any;
  itemType: string;
}

const AccordionDragPreview: React.FC<AccordionDragPreviewProps> = ({ item, itemType }) => {
  const isSubSection = itemType === 'PAGE_SUB_SECTION' || item.isSubSection;
  
  // Extract section name - handle both string and object { en, ar } formats
  const getSectionName = (name: any): string => {
    if (!name) return '';
    if (typeof name === 'string') return name;
    if (typeof name === 'object' && name !== null) {
      return name.en || name.ar || '';
    }
    return String(name);
  };

  const sectionName = getSectionName(item.sectionName);
  const sectionType = typeof item.sectionType === 'string' ? item.sectionType : '';
  
  return (
    <div className={`drag-preview-header ${isSubSection && 'sub-section'}`}>
      <div className="header-content">
        <p>
          <span className="icon drag drag-icon-container">{largeDragIcon}</span>
          <div>
            <div className="section-info">
              <span>
                {isSubSection ? 'Sub section' : 'Section'} {item.sectionKey}
              </span>
              {sectionName && (
                <Fragment>
                  <span>|</span>
                  <span className="capitalize">{sectionName.replaceAll('-', ' ')}</span>
                </Fragment>
              )}
            </div>
            {sectionType && (
              <div className="capitalize section-type">
                type: {sectionType.replaceAll('_', ' ')}
              </div>
            )}
          </div>
        </p>
        <div className="section-controls">
          <span className='icon'>
            {deleteIcon}
          </span>
          <ExpandAccordion expand={false} />
        </div>
      </div>
    </div>
  );
};

export default AccordionDragPreview;
