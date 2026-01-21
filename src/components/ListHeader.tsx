import { ReactNode } from "react";

const ListHeader = ({children,customClass}:{children:ReactNode,customClass?:string}) => {
    return ( 
        <div className={`list_header_container ${customClass}`}>
            {children}
        </div>
    );
}

export default ListHeader;