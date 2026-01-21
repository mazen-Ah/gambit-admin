import React, { Fragment } from 'react';
import { AccordionSummary } from '@mui/material';
import { deleteIcon, largeDragIcon, copyIcon } from '../../../config/variables';
import { ISection } from '../types/interfaces';
import ExpandAccordion from '../../../components/ExpandesAccordion';
import { useTranslation } from 'react-i18next';

interface SectionHeaderProps {
  data: ISection;
  index: number;
  expanded: number;
  subSection?: boolean;
  dragRef?: any;
  onDelete: (e: React.MouseEvent) => void;
  onDuplicate: (e: React.MouseEvent) => void;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  data,
  index,
  expanded,
  subSection = false,
  dragRef,
  onDelete,
  onDuplicate
}) => {
  const { i18n } = useTranslation();
  
  // Get the name based on current language or fallback
  const displayName = typeof data?.name === 'object' && data?.name !== null
    ? ((data.name as any)?.[i18n.language as 'en' | 'ar'] || (data.name as any)?.en || (data.name as any)?.ar || '')
    : (typeof data?.name === 'string' ? data.name : '');
  
  const formattedName = typeof displayName === 'string' 
    ? displayName.replaceAll('-', ' ') 
    : displayName;

  return (
    <AccordionSummary
      className={`header-container ${expanded !== index && 'expand'} ${subSection && 'sub-section'} accordion-summary-focus`}
      aria-controls="panel1a-content"
      id="panel1a-header"
    >
      <div className="header-content">
        <p>
          <span className="icon drag drag-icon-container" ref={dragRef}>{largeDragIcon}</span>
          <div>
            <div className="section-info">
              <span>
                {subSection ? 'Sub section' : 'Section'} {data?.key}
              </span>
              {displayName && (
                <Fragment>
                  <span>|</span>
                  <span className="capitalize">{formattedName}</span>
                </Fragment>
              )}
            </div>
            {data?.type && (
              <div className="capitalize section-type">
                type: {data?.type?.replaceAll('_', ' ')}
              </div>
            )}
          </div>
        </p>
        <div className="section-controls">
          <span
            onClick={onDuplicate}
            className='icon'
            title="Duplicate section"
          >
            {copyIcon}
          </span>
          <span
            onClick={onDelete}
            className='icon'
          >
            {deleteIcon}
          </span>
          <ExpandAccordion expand={expanded === index} />
        </div>
      </div>
    </AccordionSummary>
  );
};

export default SectionHeader;
