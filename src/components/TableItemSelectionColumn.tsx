interface IProps {
    setSelectedItems: React.Dispatch<React.SetStateAction<string[]>>
    id: string
    selectedItems: string[]
    handleBulkSelection: any
    customClass?: string
}

const TableItemSelectionColumn = ({ setSelectedItems, id, selectedItems, handleBulkSelection, customClass }: IProps) => {
    return (
        <div className={`column selected_col ${customClass}`} onClick={(e) => { e.stopPropagation(); handleBulkSelection(selectedItems, setSelectedItems, id) }}>
            <div className="selection_icon">
                {(selectedItems && selectedItems?.includes(id)) &&
                    <div className="tick">
                        <svg
                            width="12"
                            height="12"
                            viewBox="0 0 17 13"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M16.6304 0.395476C17.1232 0.882215 17.1232 1.73401 16.6304 2.22075L6.92698 12.6045C6.47213 13.1318 5.67614 13.1318 5.22129 12.6045L0.369565 7.41264C-0.123188 6.9259 -0.123188 6.0741 0.369565 5.58736C0.824415 5.06006 1.6204 5.06006 2.07525 5.58736L6.05518 9.84633L14.9247 0.395476C15.3796 -0.131825 16.1756 -0.131825 16.6304 0.395476Z"
                                fill={"#000"}
                            />
                        </svg>
                    </div>
                }
            </div>
        </div>
    );
}

export default TableItemSelectionColumn;