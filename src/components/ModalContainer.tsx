const ModalContainer = ({children, small, customClass, overflow}:any) => {
    return (
        <div className={`modal_container ${small ? 'small' : ''} ${customClass} cursor-normal`} onClick={(e) => {
            e.stopPropagation()
        }}>
            <div className={`modal ${overflow? "overflow" : ""}`}>
                {children}
            </div>
        </div>
    );
}

export default ModalContainer;