import { GroupBase, StylesConfig } from "react-select";

interface IProvidedStyles {
    backgroundColor?: string;
    color?: string;
    padding?: string;
    zIndex?: string;
    borderRadius?: string;
    overflow?: string;
	boxShadow?: string;
    minWidth?: string;
	border?: string;
	transition?:string;
	cursor?: string;
	fontSize?: string;
	margin?: string;
	textTransform?: string;
	paddingInline?: string;
	height?: string;
	display?: string;
	flexWrap?: string
	"&:hover": {
		backgroundColor?: string;
		color?: string;
	}
	


    // add other properties as needed
  }

	/**
	 *     background-color: light-dark(rgba(239, 239, 239, 0.3), rgba(59, 59, 59, 0.3));
    color: light-dark(rgb(84, 84, 84), rgb(170, 170, 170));
	 */

export const customStyles = {
	menu: (provided: IProvidedStyles, state: any) => ({
		...provided,
		backgroundColor: '#000',
		color: '#fff',
		padding: '0',
		zIndex: '2',
		borderRadius: "8px",
		overflow: "hidden"
	}),
	menuList: (provided: IProvidedStyles, state: any) => ({
		...provided,
		padding: 0,
		maxHeight: '13em',
	}),
	control: (provided: IProvidedStyles, state: any) => ({
		...provided,
		// backgroundColor: 'unset',
		backgroundColor: state.isDisabled ? "rgba(239, 239, 239, 0.3)" : '#fff',
		boxShadow: 'none',
		// borderRadius: '8px',
		borderRadius: '2.25rem',
		height: '3.2rem',
        minWidth: '8rem',
		transition: '1s all',
		zIndex: '1',
		cursor: 'pointer',
		// padding: "0 0.75rem",
		padding: "0 1rem",
		borderColor: '#e5e5e5',
		fontSize: "0.75rem",
		'&:hover': {
			borderColor: '#e5e5e5'
		}

	}),
	singleValue: (provided: IProvidedStyles, state: any) => ({
		...provided,
		color: state.isDisabled ? "rgb(84, 84, 84)" : '#000',
		fontSize: "0.75rem",
		margin: 0,
		overflow: "unset",
		'&:disabled': {
			color: 'red',
			fontSize: "0.75rem"
		}
	}),
	placeholder: (provided: IProvidedStyles, state: any) => ({
		...provided,
		color: state.isDisabled ? "rgb(84, 84, 84)" : '#000',
		fontSize: "0.75rem",
		width: "100%",
		textTransform: "capitalize",
		opacity:state.isDisabled ? 1 : ".6",
	}),
	dropdownIndicator: (provided: IProvidedStyles, state: any) => ({
		...provided,
		color: state.isDisabled ? "rgb(150, 150, 150)" : '#000',
		padding: 0
	}),
	indicatorSeparator: (provided: IProvidedStyles, state: any) => ({
		...provided,
		display: 'none',
	}),
	valueContainer: (provided: IProvidedStyles, state: any) => ({
		...provided,
		padding: '0',
		height: '100%',
		display: 'flex',
		flexWrap: 'nowrap',
	}),
	option: (provided: IProvidedStyles, state: any) => ({
		...provided,
		cursor: 'pointer',
		fontSize: "0.75rem",
        paddingInline: "0.75rem",
		// backgroundColor: state.isSelected ? '#000' : '#fff',
		// color: state.isSelected ? '#fff' : '#000',
		backgroundColor: (state.isFocused && !state.isSelected) ?  'rgba(255, 255, 255, 0.3)' : state.isSelected ? '#000' : '#fff',
		color: (state.isSelected || state.isFocused) ? '#fff' : '#000',
        '&:hover': {
            backgroundColor: !state.isSelected && 'rgba(255, 255, 255, 0.3)',
            color: !state.isSelected && '#fff'
        }
	}),
	multiValueRemove: (provided: IProvidedStyles, state: any) => ({
		...provided,
		transition: '.2s',
		'&:hover': {
			backgroundColor: "#000",
			color: "#fff"
		}
	  }),
		// multiValue: (provided, state) => {
		// 	return {
		// 		...provided,
		// 		minWidth: '70px'
		// 	};
		// },
};

export const customSelectStyles = {
  ...customStyles,
  control: (provided: any, state: any) => ({
    ...customStyles.control(provided, state),
    fontSize: '0.85rem !important'
  }),
  placeholder: (provided: any, state: any) => ({
    ...customStyles.placeholder(provided, state),
    fontSize: '0.85rem !important'
  }),
  option: (provided: any, state: any) => ({
    ...customStyles.option(provided, state),
    fontSize: '0.85rem !important'
  }),
  singleValue: (provided: any, state: any) => ({
    ...customStyles.singleValue(provided, state),
    fontSize: '0.85rem !important'
  })

};

type MyOptionType = {
	label: string;
	value: string;
  };

  type IsMult = false;
export const paginationOptionsStyles : StylesConfig<MyOptionType, IsMult> = {
	menu: (provided, state) => ({
		...provided,
		backgroundColor: '#000',
		color: '#fff',
		padding: '0',
		zIndex: '2',
		overflow: "hidden"
	}),
	menuList: (provided, state) => ({
		...provided,
		padding: 0,
		maxHeight: '13em',
	}),
	control: (provided, state) => ({
		...provided,
		backgroundColor: '#fff',
		boxShadow: 'none',
        minWidth: '3rem',
		border: "none",
		transition: '1s all',
		zIndex: '1',
		cursor: 'pointer',
		fontSize: "0.75rem",

	}),
	singleValue: (provided, state) => ({
		...provided,
		color: state.isDisabled ? "rgba(0,0,0,0.7)" : '#000',
		fontSize: "0.75rem",
		margin: 0,
		overflow: "unset",
		'&:disabled': {
			color: 'red',
			fontSize: "0.75rem"
		}
	}),
	placeholder: (provided, state) => ({
		...provided,
		color: '#000',
		fontSize: "0.75rem",
		width: "100%",
		textTransform: "capitalize"
	}),
	dropdownIndicator: (provided, state) => ({
		...provided,
		color: state.isDisabled ? "rgba(0,0,0,0.7)" : '#000',
		padding: 0
	}),
	indicatorSeparator: (provided, state) => ({
		...provided,
		display: 'none',
	}),
	valueContainer: (provided, state) => ({
		...provided,
		padding: '0',
		height: '100%',
		display: 'flex',
		flexWrap: 'nowrap'
	}),
	option: (provided, state) => ({
		...provided,
		cursor: 'pointer',
		fontSize: "0.75rem",
        paddingInline: "0.75rem",
		// backgroundColor: state.isSelected ? '#000' : '#fff',
		// color: state.isSelected ? '#fff' : '#000',
		backgroundColor: (state.isFocused && !state.isSelected) ?  'rgba(255, 255, 255, 0.3)' : state.isSelected ? '#000' : '#fff',
		color: (state.isSelected || state.isFocused) ? '#fff' : '#000',
        '&:hover': {
            backgroundColor: !state.isSelected ? 'rgba(255, 255, 255, 0.3)' : "",
            color: !state.isSelected ? '#fff' : ""
        }
	}),
	multiValueRemove: (provided, state) => ({
		...provided,
		transition: '.2s',
		// '&:hover': {
		// 	backgroundColor: "#000",
		// 	color: "#fff"
		// }
	  }),
		multiValue: (provided, state) => {
			return {
				...provided,
				minWidth: '70px'
			};
		},
};

export const sortStyles: StylesConfig<{ value: string; label: string; }, false, GroupBase<{ value: string; label: string; }>>= {
	menu: (provided, state) => ({
		...provided,
		backgroundColor: '#000',
		color: '#fff',
		padding: '0',
		zIndex: '2',
		borderRadius: "8px",
		overflow: "hidden",
		minWidth:"10rem"
	}),
	menuList: (provided, state) => ({
		...provided,
		padding: 0,
		maxHeight: '13em',
	}),
	control: (provided, state) => ({
		...provided,
		// backgroundColor: 'unset',
		// backgroundColor: '#fff',
		boxShadow: 'none',
		borderRadius: '8px',
		height: '2.85rem',
        width: '100%',
		minWidth:"8rem",
		transition: '1s all',
		zIndex: '1',
		cursor: 'pointer',
		// padding: "0 0.75rem",
		padding: "0 .75rem",
		borderColor: '#f0f0f0',
		fontSize: "0.75rem",
		'&:hover': {
			borderColor: '#e5e5e5'
		}

	}),
	singleValue: (provided, state) => ({
		...provided,
		color: state.isDisabled ? "rgba(0,0,0,0.7)" : '#000',
		fontSize: "0.75rem",
		margin: 0,
		overflow: "unset",
		'&:disabled': {
			color: 'red',
			fontSize: "0.75rem"
		}
	}),
	placeholder: (provided, state) => ({
		...provided,
		color: '#000',
		fontSize: ".75rem",
		width: "100%",
		textTransform: "capitalize",
		opacity:".5"

	}),
	dropdownIndicator: (provided, state) => ({
		...provided,
		color: state.isDisabled ? "rgba(0,0,0,0.7)" : '#000',
		padding: 0
	}),
	indicatorSeparator: (provided, state) => ({
		...provided,
		display: 'none',
	}),
	valueContainer: (provided, state) => ({
		...provided,
		padding: '0',
		height: '100%',
		display: 'flex',
		flexWrap: 'nowrap'
	}),
	option: (provided, state) => ({
		...provided,
		cursor: 'pointer',
		fontSize: "0.75rem",
        paddingInline: "0.75rem",
		// backgroundColor: state.isSelected ? '#000' : '#fff',
		// color: state.isSelected ? '#fff' : '#000',
		backgroundColor: (state.isFocused && !state.isSelected) ?  'rgba(255, 255, 255, 0.3)' : state.isSelected ? '#000' : '#fff',
		color: (state.isSelected || state.isFocused) ? '#fff' : '#000',
        '&:hover': {
            backgroundColor: !state.isSelected ? 'rgba(255, 255, 255, 0.3)' : "",
            color: !state.isSelected ? '#fff' : ""
        }
	}),
	multiValueRemove: (provided, state) => ({
		...provided,
		transition: '.2s',
		'&:hover': {
			backgroundColor: "#000",
			color: "#fff"
		}
	  }),
		// multiValue: (provided, state) => {
		// 	return {
		// 		...provided,
		// 		minWidth: '70px'
		// 	};
		// },
};
export const paginationControlStyles : StylesConfig<{ value: string; label: string; }, false, GroupBase<{ value: string; label: string; }>> = {
	control: (provided, state) => ({
	  ...provided,
	  minWidth: '5rem', 
		boxShadow: 'none',
		borderRadius: '8px',
		height: '2.85rem',
        width: '100%',
		transition: '1s all',
		zIndex: '1',
		cursor: 'pointer',
		padding: "0 .75rem",
		borderColor: '#f0f0f0',
		fontSize: "0.75rem",
		'&:hover': {
			borderColor: '#e5e5e5'
		}
	}),
  };
  


export const MuiMultiSelectControlStyles = {
	flex: '1 1', // Apply flex-grow and flex-shrink
	m: 1,
	width: '100%',
	borderColor: '#e5e5e5', // Default border color
	transition: '0.2s all', // Transition for smooth property changes
	margin: '0',
	


	// 'svg' : {color : '#000'},
	
	'& .MuiOutlinedInput-root': {
	  borderRadius: '2.25rem', // Rounded corners
	  fontSize: '0.9rem', // Font size for input text
	  backgroundColor: '#fff', // Background color for input


	  '& fieldset': {
		borderColor: '#e5e5e5', // Border color remains static
		// borderWidth: '1px' // Default border width
	  },

	  '&:hover fieldset': {
		borderColor: '#e5e5e5' // No change on hover
	  },

	  '&.Mui-focused fieldset': {
		borderColor: '#e5e5e5', // No change on focus
		boxShadow: 'none' // Disable shadow on focus
	  }
	},

	'& .MuiInputBase-input': {
	  color: '#000', // Input text color
	  padding: '1rem 1.5rem', // Padding for input text
	  fontSize: '0.9rem', // Font size
	  fontFamily: 'PlusJakartaSans-Medium, sans-serif, Arial',

	},

	'& .MuiInputLabel-root': {
	  color: '#000', // Label text color
	  fontSize: '1rem', // Label font size
	  '&.Mui-focused': {
		color: '#000' // No change on focus
	  }
	},

	'& .MuiSelect-icon': {
	  color: '#000', // Icon color stays the same
	  display: 'none',

	},
	'& .MuiSelect-iconCustom': {
	  position: 'absolute',
	  right: '1rem',
	  top: '50%',
	  cursor: 'pointer',
	  transform: 'translateY(-50%)',
	  '&:hover': {
		opacity: '60%'
	  },
	  svg: {
		width: 20,
		height: 20,
	  }

	}
  }
export const MuiMultiSelectPaperPropsStyles = {
	// borderRadius: '8px', // Rounded corners for the dropdown
	// backgroundColor: '#fff', // Background for dropdown
	
	'.MuiMenu-list' : {
		paddingTop: '0 ',
		
	},
	
	'& .MuiSelect-option:first-child:not(.Mui-selected)': {
      backgroundColor: 'transparent',
	},

	'& .MuiMenuItem-root': {
	  fontSize: '0.85rem', // Font size for options
	  padding: '8px 16px', // Padding for the options
	  color: '#000', // Default text color for options
	  '.MuiTypography-root': {
		fontSize: '0.75rem', // Font size for option text
		fontFamily: 'PlusJakartaSans-Medium, sans-serif, Arial',
		},
	  '&:hover': {
		backgroundColor: '#999999' ,// Background on hover
		color: '#fff',
		'.Mui-checked': {
			color: '#fff'
		}
	  },
	  '&.Mui-selected': {
		backgroundColor: '#999999', // Background for selected option
		color: '#fff', // Text color for selected option
		'.Mui-checked': {
			color: '#fff'
		}
	  },
	  '&.Mui-selected:hover': {
		backgroundColor: '#999999',
		color: '#fff',
		'.Mui-checked': {
			color: '#fff'
		}
		// backgroundColor: '#000', // Background for selected option on hover
	  }
	}
  }
export const MuiMultiSelectCheckboxStyles = {
	color: 'black', // Default color
	padding: '0',
	paddingInlineEnd: "9px",
	'&.Mui-checked': {
	  color: 'black' // Checked color
	},
	'&:hover': {
	//   backgroundColor: 'rgba(0,0,0 )' // Hover background
	},
	'& .MuiSvgIcon-root': {
	  fontSize: '1rem' // Size of the checkbox icon
	}
  }