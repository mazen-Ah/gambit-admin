import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { generalGet } from '../../API/api';
import ModalContainer from '../ModalContainer';
import ChangeStatusModal from './ChangeStatusModal';
import SwitchActivation from './SwitchActivation';
import Cookies from 'js-cookie';
import { setOfferIsActive } from '../../store/redux/breadCrumbsData';
import { hasPermission } from '../../utils/HelperFunctions';
const Breadcrumbs = () => {
  const [modalOpen, setModalOpen] = useState<any>(null);
  const breadcrumbsData = useSelector((store: any) => store.breadCrumbsData.breadCrumbsData);
  const [isServiceDetails, setIsServiceDetails] = useState<boolean>(false);
  const [isDistributorDetails, setIsDistributorDetails] = useState<boolean>(false);
  const [isSellerDetails, setIsSellerDetails] = useState<boolean>(false);
  const [isApplicationDetails, setIsApplicationDetails] = useState<boolean>(false);
  const [isOfferDetails, setIsOfferDetails] = useState<boolean>(false);
  const [isUserDetails, setIsUserDetails] = useState<boolean>(false);
  const [serviceIsActive, setServiceIsActive] = useState<boolean>(false);
  const [distributorIsActive, setDistributorIsActive] = useState<boolean>(false);
  const [sellerIsActive, setSellerIsActive] = useState<boolean>(false);
  const [userIsActive, setUserIsActive] = useState<boolean>(false);
  const [applicationStatus, setApplicationStatus] = useState<{ value: number; lang: string }>();
  const [refetch, setRefetch] = useState(false);
  const { t, i18n } = useTranslation();
  const { pathname } = useLocation();
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const status = urlParams?.get('updated');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isOfferActive = useSelector((store: any) => store.breadCrumbsData.breadCrumbsData.offerIsActive);

  const { data, isSuccess, isLoading } = useQuery({
    queryKey: ['service providers', isServiceDetails, i18n.language, breadcrumbsData, refetch],
    queryFn: () => generalGet(`/service-providers/${breadcrumbsData?.serviceProviderId}`),
    refetchOnWindowFocus: false,
    enabled: isServiceDetails === true && !!breadcrumbsData?.serviceProviderId
  });

  const {
    data: distData,
    isSuccess: distIsSuccess,
    isLoading: distIsLoading
  } = useQuery({
    queryKey: ['Distributor', isDistributorDetails, i18n.language, breadcrumbsData, refetch],
    queryFn: () => generalGet(`/distributors/${breadcrumbsData?.distributorId}`),
    refetchOnWindowFocus: false,
    enabled: isDistributorDetails === true && !!breadcrumbsData?.distributorId
  });

  const {
    data: sellerData,
    isSuccess: sellerIsSuccess,
    isLoading: sellerIsLoading
  } = useQuery({
    queryKey: ['sellerDetails', i18n.language, breadcrumbsData, refetch],
    queryFn: () => generalGet(`/admin/users/${breadcrumbsData?.salesId}`),
    refetchOnWindowFocus: false,
    enabled: isSellerDetails === true && !!breadcrumbsData?.salesId
  });

  const {
    data: appData,
    isSuccess: appIsSuccess,
    isLoading: appIsLoading
  } = useQuery({
    queryKey: ['applicationDetails', i18n.language, breadcrumbsData, refetch, status],
    queryFn: () => generalGet(`/applications/${breadcrumbsData?.applicationId}`),
    refetchOnWindowFocus: false,
    enabled: isApplicationDetails === true && !!breadcrumbsData?.applicationId
  });

  const {
    data: userData,
    isSuccess: userIsSuccess,
    isLoading: userIsLoading
  } = useQuery({
    queryKey: ['users', i18n.language, breadcrumbsData, refetch, status],
    queryFn: () => generalGet(`/admin/users/${breadcrumbsData?.userId}`),
    refetchOnWindowFocus: false,
    enabled: isUserDetails === true && !!breadcrumbsData?.userId
  });

  useEffect(() => {
    const reqData = data?.data.data;
    if (isSuccess) {
      setServiceIsActive(reqData?.serviceProvider.is_active);
    }
  }, [isSuccess, data, i18n]);

  useEffect(() => {
    const reqData = distData?.data.data;
    if (distIsSuccess) {
      setDistributorIsActive(reqData?.distributor?.is_active);
    }
  }, [distData, distIsSuccess, i18n]);

  useEffect(() => {
    const reqData = sellerData?.data.data;
    if (sellerIsSuccess) {
      setSellerIsActive(reqData?.status == 2 ? true : false);
    }
  }, [sellerData, sellerIsSuccess, i18n]);

  useEffect(() => {
    const reqData = appData?.data.data;
    if (appIsSuccess) {
      setApplicationStatus(reqData?.status);
    }
  }, [appData, appIsSuccess, i18n]);

  useEffect(() => {
    const reqData = appData?.data.data;
    if (appIsSuccess) {
      setApplicationStatus(reqData?.status);
    }
  }, [appData, appIsSuccess, i18n]);

  useEffect(() => {
    const reqData = userData?.data.data;
    if (userIsSuccess) {
      setUserIsActive(reqData?.status == 2 ? true : false);
    }
  }, [userData, userIsSuccess, i18n]);

  const insideO = Cookies.get('inside_offer');
  useEffect(() => {
    if (pathname === `/services/${breadcrumbsData?.serviceProviderId}`) {
      setRefetch(true);
      setIsServiceDetails(true);
    } else if (pathname === `/distributors/${breadcrumbsData?.distributorId}`) {
      setRefetch(true);
      setIsDistributorDetails(true);
    } else if (pathname === `/sales/${breadcrumbsData?.salesId}`) {
      setRefetch(true);
      setIsSellerDetails(true);
    } else if (pathname === `/applications/${breadcrumbsData?.applicationId}`) {
      setRefetch(true);
      setIsApplicationDetails(true);
    } else if (pathname === `/users/create-user/${breadcrumbsData?.userId}`) {
      setRefetch(true);
      setIsUserDetails(true);
    } else if (Cookies.get('insideOffer')) {
      setRefetch(true);
      setIsOfferDetails(true);
    } else {
      if (insideO) {
        setIsOfferDetails(true);
      } else {
        setIsOfferDetails(false);
      }
      setIsServiceDetails(false);
      setIsDistributorDetails(false);
      setIsSellerDetails(false);
      setIsUserDetails(false);
    }
  }, [pathname, breadcrumbsData]);

  useEffect(() => {
    setRefetch(true);
  }, [pathname]);

  return (
    <>
      <div className="breadcrumbs">
        <div className="titles" style={{ display: 'flex', alignItems: 'center' }}>
          <div className="" style={{ display: 'flex', alignItems: 'center' }}>
            <div className="" onClick={() => navigate(-1)}>
              <svg xmlns="http://www.w3.org/2000/svg" width="31" height="31" viewBox="0 0 21 21" fill="none" style={{ cursor: 'pointer', marginRight: i18n.language === 'ar' ? '0' : '1rem', marginLeft: i18n.language === 'ar' ? '1rem' : '0', transform: i18n.language === 'ar' ? 'rotate(180deg)' : '' }}>
                <path d="M11.4 16.4L7.8 12.9H20V10.9H7.8L11.4 7.4L9.9 6L4 11.9L9.9 17.8L11.4 16.4Z" fill="black" />
              </svg>
            </div>
            <h4 className="page_title">{breadcrumbsData.page_title}</h4>
          </div>
          {hasPermission(['offers.edit']) && isOfferDetails && (
            <SwitchActivation
              loading={isLoading}
              onChange={
                () => dispatch(setOfferIsActive(!isOfferActive))
              }
              active={isOfferActive}
            />
          )}
          {hasPermission(['service_providers.crud']) && isServiceDetails && (
            <SwitchActivation
              loading={isLoading}
              onChange={() =>
                setModalOpen({
                  post: false,
                  id: breadcrumbsData?.serviceProviderId,
                  route: `/service-providers/${breadcrumbsData?.serviceProviderId}/toggle-active`,
                  successMsg: t('service_status'),
                  warningMsg: t('sure_service_status')
                })
              }
              active={serviceIsActive}
            />
          )}
          {hasPermission(['distributors.edit']) && isDistributorDetails && (
            <SwitchActivation
              loading={distIsLoading}
              onChange={() =>
                setModalOpen({
                  post: false,
                  id: breadcrumbsData?.distributorId,
                  route: `/distributors/${breadcrumbsData?.distributorId}/toggle-active`,
                  successMsg: t('distributor_status'),
                  warningMsg: t('sure_distributor_status')
                })
              }
              active={distributorIsActive}
            />
          )}
          {hasPermission(['users.edit']) && isSellerDetails && (
            <SwitchActivation
              loading={sellerIsLoading}
              onChange={() =>
                setModalOpen({
                  post: true,
                  id: breadcrumbsData?.salesId,
                  route: `/users/${breadcrumbsData?.salesId}/toggle-status`,
                  successMsg: t('user_status'),
                  warningMsg: t('sure_user_status')
                })
              }
              active={sellerIsActive}
            />
          )}
          {hasPermission(['users.edit']) && isUserDetails && (
            <SwitchActivation
              loading={userIsLoading}
              onChange={() =>
                setModalOpen({
                  post: true,
                  id: breadcrumbsData?.userId,
                  route: `/users/${breadcrumbsData?.userId}/toggle-status`,
                  successMsg: t('user_status_success'),
                  warningMsg: t('user_status_update')
                })
              }
              active={userIsActive}
            />
          )}
          {appData && (
            <div
              className={`status  ${applicationStatus?.value == 1 ? 'inProgress' : applicationStatus?.value == 2 ? 'active' : 'rejected'} ${appIsLoading || isLoading ? 'loading' : ''}`}
              //  onClick={() => setAppModelOpen(true)}
            >
              {appIsLoading ? <div className="loader"></div> : applicationStatus && applicationStatus.lang}
            </div>
          )}
        </div>
      </div>
      {modalOpen && (
        <ModalContainer small>
          <ChangeStatusModal
            setRefetchData={setRefetch}
            id={modalOpen.id}
            setModal={setModalOpen}
            route={modalOpen.route}
            successMsg={modalOpen.successMsg}
            warningMsg={modalOpen.warningMsg}
            setIsActive={isDistributorDetails ? setDistributorIsActive : isSellerDetails ? setSellerIsActive : setServiceIsActive}
            post={modalOpen.post}
          />
        </ModalContainer>
      )}
    </>
  );
};

export default Breadcrumbs;
