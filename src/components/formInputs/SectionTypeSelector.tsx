import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { getIn, ErrorMessage } from 'formik';
import { useTranslation } from 'react-i18next';
import './SectionTypeSelector.scss';

type SectionTypeOption = {
  label: string;
  value: string;
  data?: any;
  image?: string | null;
};

type SectionTypeSelectorProps = {
  options: SectionTypeOption[];
  value: string | null;
  onChange: (value: string) => void;
  placeholder?: string;
  formik?: any;
  inputName?: string;
};

const ChevronDownIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8.25 14.25C11.5637 14.25 14.25 11.5637 14.25 8.25C14.25 4.93629 11.5637 2.25 8.25 2.25C4.93629 2.25 2.25 4.93629 2.25 8.25C2.25 11.5637 4.93629 14.25 8.25 14.25Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M15.75 15.75L12.4875 12.4875" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const CloseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M13.5 4.5L4.5 13.5M4.5 4.5L13.5 13.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const SectionTypeSelector: React.FC<SectionTypeSelectorProps> = ({
  options,
  value,
  onChange,
  placeholder,
  formik,
  inputName
}) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const selectedOption = useMemo(() => {
    return options.find(opt => opt.value === value) || null;
  }, [options, value]);

  const filteredOptions = useMemo(() => {
    if (!searchQuery.trim()) return options;
    const query = searchQuery.toLowerCase();
    return options.filter(opt => 
      opt.label.toLowerCase().includes(query) ||
      opt.value.toLowerCase().includes(query)
    );
  }, [options, searchQuery]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery('');
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = useCallback((option: SectionTypeOption) => {
    onChange(option.value);
    setIsOpen(false);
    setSearchQuery('');
  }, [onChange]);

  const handleToggle = useCallback(() => {
    setIsOpen(prev => !prev);
    if (!isOpen) {
      setSearchQuery('');
    }
  }, [isOpen]);

  const handleClear = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    setIsOpen(false);
    setSearchQuery('');
  }, [onChange]);

  const hasError = formik && inputName && getIn(formik.errors, inputName) && getIn(formik.touched, inputName);

  return (
    <div className="section-type-selector" ref={containerRef}>
      <div 
        className={`section-type-selector__trigger ${isOpen ? 'is-open' : ''} ${hasError ? 'has-error' : ''}`}
        onClick={handleToggle}
      >
        <div className="section-type-selector__trigger-content">
          {selectedOption ? (
            <div className="section-type-selector__selected">
              {selectedOption.image && (
                <div className="section-type-selector__selected-image">
                  <img 
                    src={selectedOption.image} 
                    alt={selectedOption.label}
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              )}
              <span className="section-type-selector__selected-label">{selectedOption.label}</span>
            </div>
          ) : (
            <span className="section-type-selector__placeholder">{placeholder || t('section_type')}</span>
          )}
        </div>
        <div className="section-type-selector__trigger-actions">
          {selectedOption && (
            <button 
              type="button"
              className="section-type-selector__clear-btn"
              onClick={handleClear}
              aria-label="Clear selection"
            >
              <CloseIcon />
            </button>
          )}
          <div className="section-type-selector__chevron">
            <ChevronDownIcon />
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="section-type-selector__dropdown">
          <div className="section-type-selector__search">
            <div className="section-type-selector__search-icon">
              <SearchIcon />
            </div>
            <input
              ref={searchInputRef}
              type="text"
              className="section-type-selector__search-input"
              placeholder={t('search') || 'Search...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
            {searchQuery && (
              <button
                type="button"
                className="section-type-selector__search-clear"
                onClick={(e) => {
                  e.stopPropagation();
                  setSearchQuery('');
                  searchInputRef.current?.focus();
                }}
              >
                <CloseIcon />
              </button>
            )}
          </div>

          <div className="section-type-selector__options">
            {filteredOptions.length === 0 ? (
              <div className="section-type-selector__no-results">
                {t('no_options') || 'No options found'}
              </div>
            ) : (
              <div className="section-type-selector__grid">
                {filteredOptions.map((option) => {
                  const isSelected = option.value === value;
                  return (
                    <div
                      key={option.value}
                      className={`section-type-selector__option ${isSelected ? 'is-selected' : ''}`}
                      onClick={() => handleSelect(option)}
                    >
                      <div className="section-type-selector__option-preview">
                        {option.image ? (
                          <img 
                            src={option.image} 
                            alt={option.label}
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const parent = target.parentElement;
                              if (parent) {
                                parent.innerHTML = '<div class="section-type-selector__option-placeholder"></div>';
                              }
                            }}
                          />
                        ) : (
                          <div className="section-type-selector__option-placeholder">
                            <span>{option.label.charAt(0).toUpperCase()}</span>
                          </div>
                        )}
                      </div>
                      <div className="section-type-selector__option-content">
                        <span className="section-type-selector__option-label">{option.label}</span>
                        {isSelected && (
                          <div className="section-type-selector__option-check">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                              <path d="M13.3333 4L6 11.3333L2.66667 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {formik && inputName && (
        <ErrorMessage name={inputName} component="div" className="section-type-selector__error" />
      )}
    </div>
  );
};
