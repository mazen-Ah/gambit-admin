import { FormControlLabel, Radio, RadioGroup } from "@mui/material";
import { ErrorMessage } from "formik";
import { useTranslation } from "react-i18next";

const RadioInput = ({ data, name, onChange, value }: any) => {

    const { t } = useTranslation()

    return (
        <>
            <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                defaultValue={value}
                name={`${name}`}
                onChange={onChange}
            >
                {data.map((item: any, index: number) => (
                    <FormControlLabel key={item} value={item.value ? item.value : item} control={
                        <Radio
                            className='normal-cursor'
                            size="small"
                            sx={{
                                color: "black",
                                '&.Mui-checked': {
                                    color: "black",
                                },
                            }}
                        />} label={t(`${item.label ? item.label : item}`)} />
                ))}

            </RadioGroup>
            <p className="error">
                <ErrorMessage name={name || "defaultName"} />
            </p>
        </>
    );
}

export default RadioInput;