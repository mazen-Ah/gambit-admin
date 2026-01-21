export interface ITextContainer {
    title: string;
    desc?: string;
    descClassName?: string
}

const TextContainer = ({ title,desc, descClassName } : ITextContainer) => {
    return (
        <div className="sign_text_container">
            <h4>{title}</h4>
            <p className={descClassName}>{desc}</p>
        </div>
    );
}

export default TextContainer;