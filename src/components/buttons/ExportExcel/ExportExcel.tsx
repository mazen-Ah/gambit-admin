import { useState } from 'react';
import { axiosInstance } from '../../../config/axiosConfig';
import Button from '../Button';
import { useTranslation } from 'react-i18next';
import { downloadFile } from '../../../utils/downloadExcelSheet';

export default function ExportExcel({
  endpoint,
  fileName,
  data,
  post,
  children,
  customClass,
  downloadFileCustomFun
}: {
  endpoint: string;
  data?: any;
  fileName: string;
  filters?: any;
  post?: boolean;
  children?: any;
  customClass?: string;
  downloadFileCustomFun?: (data: Blob, fileName: string) => void;
}) {
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  async function exportReport() {
    setLoading(true);
    let link = endpoint;
    const response = await (post
      ? axiosInstance.post(link, data, { responseType: 'blob' })
      : axiosInstance.get(link, { responseType: 'blob' }));

    downloadFileCustomFun ? downloadFileCustomFun(response.data, fileName) : downloadFile(response.data, fileName);
    setLoading(false);
  }

  return <Button customClass={customClass || ''} onClick={exportReport} loading={loading} type="button" text={children || t('export_excel')} />;
}
