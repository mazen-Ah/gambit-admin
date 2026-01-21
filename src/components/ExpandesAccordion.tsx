interface IExpandesAccordion {
    expand: boolean
}
const ExpandAccordion = ({expand} : IExpandesAccordion ) => {
    return (
        <>
            {expand ? <svg style={{marginInlineEnd:'.25rem'}} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1" fill="none" />
                <rect x="4.5" y="7.5" width="7" height="1.25" fill="currentColor" strokeWidth='1' />
            </svg> :
                <svg style={{marginInlineEnd:'.25rem'}} width="16" height="16" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8.9375 12.625V9.8125H6.125C5.80859 9.8125 5.5625 9.56641 5.5625 9.25C5.5625 8.96875 5.80859 8.6875 6.125 8.6875H8.9375V5.875C8.9375 5.59375 9.18359 5.3125 9.5 5.3125C9.78125 5.3125 10.0625 5.59375 10.0625 5.875V8.6875H12.875C13.1562 8.6875 13.4375 8.96875 13.4375 9.25C13.4375 9.56641 13.1562 9.8125 12.875 9.8125H10.0625V12.625C10.0625 12.9414 9.78125 13.1875 9.5 13.1875C9.18359 13.1875 8.9375 12.9414 8.9375 12.625ZM18.5 9.25C18.5 14.2422 14.457 18.25 9.5 18.25C4.50781 18.25 0.5 14.2422 0.5 9.25C0.5 4.29297 4.50781 0.25 9.5 0.25C14.457 0.25 18.5 4.29297 18.5 9.25ZM9.5 1.375C5.14062 1.375 1.625 4.92578 1.625 9.25C1.625 13.6094 5.14062 17.125 9.5 17.125C13.8242 17.125 17.375 13.6094 17.375 9.25C17.375 4.92578 13.8242 1.375 9.5 1.375Z" fill="currentColor" />
                </svg>
            }
        </>
    );
}

export default ExpandAccordion;