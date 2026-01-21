import { useMemo } from "react";

const PermissionsData = ({ data, text }: any) => {
    const handledData: any = useMemo(() => {
        return data?.permissions.filter((item: any) => item.name.includes(text));
    }, [data, text]);
    return (
        <>
            {handledData?.length > 0 &&
                <div className="permissions-data">
                    <h4>{text}</h4>
                    <div className="data">
                        {handledData?.map((item: any, index: number) => (
                            <p key={index}>{item.name}</p>
                        ))}
                    </div>
                </div>}
        </>
    );
}

export default PermissionsData;