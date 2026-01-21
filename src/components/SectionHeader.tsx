import { IFormHeader } from "../types/Interfaces";

const SectionHeader = ({title , customStyle, rightComp, children}:IFormHeader) => {
    return (
        <div className={`section_header ${customStyle}`}>
            {(title || rightComp) && <div className="section_header_content">
                {title && <h4>{title}</h4>}
                {rightComp ? rightComp : ""}
            </div>}
            {children}
        </div>
    );
}

export default SectionHeader;