import { useState } from "react";

let debounce: NodeJS.Timeout;
const SearchInputField = ({ placeholder, setSearchInput, searchInput }: any) => {
  const [inputValue, setInputValue] = useState(searchInput)

  function handleSearchChange(value: string){
    setInputValue(value)
    debounce && clearTimeout(debounce)
    debounce = setTimeout(() => {
      setSearchInput(value)
    }, 500)
  }

  return (
    <div className="search_input_field">
      <div className="input_wrapper">
        <svg width="13" height="13" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            opacity="0.6"
            d="M10.8926 11.2949C11.0215 11.4238 11.0215 11.6602 10.8926 11.7891C10.8281 11.8535 10.7422 11.875 10.6562 11.875C10.5488 11.875 10.4629 11.8535 10.377 11.7891L7.34766 8.73828C6.55273 9.42578 5.54297 9.8125 4.44727 9.8125C1.99805 9.8125 0 7.81445 0 5.34375C0 2.89453 1.97656 0.875 4.44727 0.875C6.89648 0.875 8.91602 2.89453 8.91602 5.34375C8.91602 6.46094 8.5293 7.4707 7.8418 8.26562L10.8926 11.2949ZM4.46875 9.125C6.55273 9.125 8.25 7.44922 8.25 5.34375C8.25 3.25977 6.55273 1.5625 4.46875 1.5625C2.36328 1.5625 0.6875 3.25977 0.6875 5.34375C0.6875 7.42773 2.36328 9.125 4.46875 9.125Z"
            fill="#211D33"
          />
        </svg>
        <input placeholder={placeholder} value={inputValue} onChange={(e) => handleSearchChange(e.target.value)} />
      </div>
    </div>
  );
};

export default SearchInputField;
