'use client';

import {
    Checkbox,
    FormControl,
    InputLabel,
    ListItemText,
    MenuItem,
    OutlinedInput,
    Select,
    SelectChangeEvent,
} from '@mui/material';
import {
    MuiMultiSelectPaperPropsStyles,
    MuiMultiSelectControlStyles
} from '../../utils/SelectStyles';
import { useTranslation } from 'react-i18next';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

interface Option {
    value: string;
    text: string;
}

interface Props {
    label: string;
    name: string;
    value: any;
    onChange: (e: SelectChangeEvent<string[]>) => void;
    options: Option[];
    selectedLabels: string[];
    error?: string | boolean;
    touched?: boolean;
    placeholder?: string;
    customIcon?: JSX.Element;
    open?: boolean;
    setOpen?: (val: boolean) => void;
    customStyles?: any
    disabled?: boolean
    gridSize?: number
    noPadding?: boolean
}

const MultiSelectDropdown = ({
    label,
    name,
    value,
    onChange,
    options,
    selectedLabels,
    error,
    touched,
    placeholder,
    customIcon,
    open,
    setOpen,
    customStyles,
    disabled,
    gridSize = 12,
    noPadding = false
}: Props) => {
    const handleOpen = () => setOpen?.(true);
    const handleClose = () => setOpen?.(false);
    const { t } = useTranslation();
    return (
        <div className={`field_wrapper_container ${noPadding ? 'no-padding' : ''} grid-${gridSize}`} style={customStyles || {}}>
            <div className={`multi-select-wrapper input_wrapper w-full `}>

                <div className="header">
                    <h5 className="title">{label}</h5>
                </div>

                <FormControl
                    sx={{
                        ...MuiMultiSelectControlStyles,
                        '& fieldset': {
                            borderColor: '#e5e5e5 !important',
                            borderWidth: '1px !important'
                        },
                        '&:hover fieldset': {
                            borderColor: '#e5e5e5'
                        },
                        '& .MuiOutlinedInput-root': {
                            backgroundColor: disabled ? 'rgba(239, 239, 239, 0.3) !important' : '#fff',
                            borderRadius: '2.25rem !important',
                            cursor: disabled ? 'default !important' : 'pointer !important',
                            '& .MuiInputBase-input': {
                                color: disabled ? 'rgb(84, 84, 84) !important' : '#000',
                                cursor: disabled ? 'default' : 'pointer'
                            }
                        },
                        '& .MuiInputLabel-root': {
                            color: disabled ? 'rgb(84, 84, 84) !important' : '#000'
                        },
                        '& .MuiSelect-icon': {
                            color: disabled ? 'rgb(150, 150, 150) !important' : '#000'
                        }
                    }}
                // error={touched && Boolean(error)}
                >
                    {(value.length === 0 || disabled) && <InputLabel shrink={false}
                        style={{
                            lineHeight: 'unset',
                            fontSize: '0.9rem',
                            left: '0.5rem',
                            top: '0.1rem',
                            color: disabled ? 'rgb(84, 84, 84)' : 'rgba(0,0,0,0.6)',
                        }}
                    >{placeholder}</InputLabel>}
                    <Select
                        multiple
                        open={open}
                        onOpen={handleOpen}
                        onClose={handleClose}
                        IconComponent={() => customIcon || null}
                        value={value}
                        onChange={onChange}
                        input={<OutlinedInput />}
                        renderValue={() => selectedLabels.join(', ')}
                        className={`select-drop-down ${error && touched && 'input-error'} ${disabled && 'disabled'}`}
                        disabled={disabled}
                        MenuProps={{
                            PaperProps: {
                                style: {
                                    maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                                    width: 150,
                                    marginTop: '0.5rem',
                                    borderRadius: '8px'
                                }
                            },
                            sx: (theme) => ({ ...MuiMultiSelectPaperPropsStyles })
                        }}
                        inputProps={{ 'aria-label': 'Without label', name }}
                    >
                        {options.length === 0 && <div className='f a-c j-c' style={{padding: "1rem"}}>{t("no_options")}</div>}
                        {options?.map((option) => {
                            return (
                                <MenuItem
                                    key={option.text}
                                    value={option.value}
                                    sx={{
                                        '&.Mui-focusVisible': { backgroundColor: 'transparent' },
                                        '&.Mui-selected': {
                                            backgroundColor: '#c7c7c7 !important',
                                            color: 'black !important'
                                        },
                                        '&:hover': {
                                            backgroundColor: '#c7c7c7 !important',
                                            color: 'black !important'
                                        }
                                    }}
                                >
                                    <Checkbox
                                        sx={{'&.Mui-checked': {
                                            color: "black !important", // Checked color
                                        }}}
                                        checked={value.indexOf(option?.value || '') > -1} />
                                    <ListItemText primary={option.text} />
                                </MenuItem>
                            )
                        })}
                    </Select>
                    {touched && error && <p className='error'>{error}</p>}
                </FormControl>
            </div>
        </div>
    );
};

export default MultiSelectDropdown;