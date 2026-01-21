import { useFormikContext } from "formik"
import { useEffect } from "react"

let debounce: NodeJS.Timeout
export default function FormikDebounce() {
  const formik = useFormikContext<any>()

  useEffect(() => {
    debounce && clearTimeout(debounce)
    debounce = setTimeout(() => {
      formik?.submitForm()
    }, 500)
  }, [formik?.values, formik])

  return null
}
