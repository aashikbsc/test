import type { GetServerSideProps, NextPage } from "next";
import { SSRAuthCheck } from "middlewares/ssr-authentication-check";
import useTranslation from "next-translate/useTranslation";
import Footer from "components/common/footer";
import { customPage, landingPage } from "service/landing-page";
import moment from "moment";
import LaunchpadSidebar from "layout/launchpad-sidebar";
import { useEffect, useState } from "react";
import {
  GetIcoWithdrawListsAction,
  GetTokenListAction,
} from "state/actions/launchpad";
import Link from "next/link";
import DataTable from "react-data-table-component";
import { handleSwapHistorySearch } from "state/actions/reports";
import { MdCreateNewFolder } from "react-icons/md";
import { IoCreateOutline } from "react-icons/io5";
import { AiFillEye, AiOutlineOrderedList } from "react-icons/ai";
import { toast } from "react-toastify";
import {
  STATUS_ACCEPTED,
  STATUS_MODIFICATION,
  STATUS_PENDING,
} from "helpers/core-constants";
import { BsFillChatFill } from "react-icons/bs";
import CustomDataTable from "components/Datatable";
import LaunchpadHeader from "components/ico/LaunchpadHeader";
import PlaceTopLeft from "components/gradient/placeTopLeft";
import PlaceBottomRight from "components/gradient/placeBottomRight";
import IcoWithdrawModal from "components/gift-cards/modal/IcoWithdrawModal";
import ReactPaginate from "react-paginate";

const Profile: NextPage = ({}: any) => {
  const [history, setHistory] = useState<any>([]);
  const { t } = useTranslation("common");
  const [search, setSearch] = useState<any>("");
  const [processing, setProcessing] = useState<boolean>(false);
  const [selectedLimit, setSelectedLimit] = useState<any>("10");
  const [stillHistory, setStillHistory] = useState<any>([]);

  const [paymentSlip, setPaymentSlip] = useState<any>();
  const [paymentDetails, setPaymentDetails] = useState<any>();
  const [modalOpen, setModalOpen] = useState<any>(false);

  const columns = [
    {
      Header: t("Transaction Type"),

      accessor: "tran_type",
      Cell: ({ cell }: any) => (
        <div>
          {cell.value == 1 && <span>{t("Fiat")}</span>}{" "}
          {cell.value == 2 && <span>{t("Crypto")}</span>}
        </div>
      ),
    },
    {
      Header: t("Request Amount"),
      Cell: ({ row }: any) => (
        <span>
          {row?.original?.request_amount} {row?.original?.request_currency}
        </span>
      ),
    },
    {
      Header: t("Convert Amount"),
      Cell: ({ row }: any) => (
        <span>
          {row?.original?.convert_amount} {row?.original?.convert_currency}
        </span>
      ),
    },
    {
      Header: t("Approved Status"),
      accessor: "approved_status",
      Cell: ({ cell }: any) => (
        <div>
          {cell.value === STATUS_PENDING ? (
            <span className="text-warning">{t("Pending")}</span>
          ) : cell.value === STATUS_ACCEPTED ? (
            <span className="text-success"> {t("Accepted")}</span>
          ) : cell.value === STATUS_MODIFICATION ? (
            <span className="text-warning"> {t("Modification request")}</span>
          ) : (
            <span className="text-danger">{t("Rejected")}</span>
          )}
        </div>
      ),
    },

    {
      Header: t("Payment Details"),
      accessor: "payment_details",
      Cell: ({ cell }: any) => (
        <div>
          {cell.value ? (
            <span
              onClick={() => {
                setModalOpen(true);
                setPaymentDetails(cell.value);
                setPaymentSlip(null);
              }}
              className="text-underline text-primary-color pointer"
            >
              {t("View")}
            </span>
          ) : (
            <span> {t("N/A")}</span>
          )}
        </div>
      ),
    },

    {
      Header: t("Payment Slip"),
      accessor: "payment_sleep",
      Cell: ({ cell }: any) => (
        <div>
          {cell.value ? (
            <span
              onClick={() => {
                setModalOpen(true);
                setPaymentSlip(cell.value);
                setPaymentDetails(null);
              }}
              className="text-underline text-primary-color pointer"
            >
              {t("View")}
            </span>
          ) : (
            <span> {t("N/A")}</span>
          )}
        </div>
      ),
    },

    {
      Header: t("Date"),
      accessor: "created_at",
      Cell: ({ cell }: any) => moment(cell.value).format("YYYY-MM-DD HH:mm:ss"),
    },
  ];
  const LinkTopaginationString = (page: any) => {
    const url = page.url.split("?")[1];
    const number = url.split("=")[1];
    GetIcoWithdrawListsAction(
      selectedLimit,
      parseInt(number),
      setHistory,
      setProcessing,
      setStillHistory,
      search
    );
  };
  useEffect(() => {
    GetIcoWithdrawListsAction(
      selectedLimit,
      1,
      setHistory,
      setProcessing,
      setStillHistory,
      search
    );
  }, [selectedLimit, search]);

  const closeModalHandle = () => {
    setModalOpen(false);
  };

  const handlePageClick = (event: any) => {
    GetIcoWithdrawListsAction(
      selectedLimit,
      event.selected + 1,
      setHistory,
      setProcessing,
      setStillHistory,
      search
    );
  };

  console.log("handlePageClick", history, stillHistory);

  return (
    <>
      <div className="page-wrap">
        {/* <LaunchpadSidebar /> */}
        <div className="page-main-content">
          <LaunchpadHeader title={t("Withdraw Lists")} />
          <PlaceTopLeft />
          <PlaceBottomRight />
          <div className="container-4xl">
            <div className="asset-balances-area shadow-sm section-padding-custom wallet-card-info-container margin-n-top-60 margin-bottom-30">
              <div className="asset-balances-left">
                <div className="section-wrapper">
                  <div className="tableScroll">
                    <CustomDataTable
                      columns={columns}
                      data={history}
                      selectedLimit={selectedLimit}
                      setSelectedLimit={setSelectedLimit}
                      search={search}
                      setSearch={setSearch}
                      processing={processing}
                      isOverflow={true}
                    />
                    {history?.length > 0 && (
                      <div className="row justify-content-end mt-1">
                        <ReactPaginate
                          nextLabel=">"
                          onPageChange={handlePageClick}
                          pageRangeDisplayed={5}
                          pageCount={Math.ceil(
                            stillHistory.total / selectedLimit
                          )}
                          previousLabel="<"
                          renderOnZeroPageCount={null}
                          className={`d-flex align-items-center justify-content-center`}
                          pageLinkClassName={`paginate-number`}
                          activeLinkClassName={`active-paginate-cls`}
                          previousLinkClassName={`text-primary-color text-25 mr-2`}
                          nextLinkClassName={`text-primary-color text-25 ml-2`}
                          forcePage={stillHistory.current_page - 1}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      {modalOpen && (
        <IcoWithdrawModal
          close={closeModalHandle}
          image={paymentSlip}
          paymentDetails={paymentDetails}
        />
      )}
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx: any) => {
  await SSRAuthCheck(ctx, "/ico/withdraw-lists");
  return {
    props: {},
  };
};
export default Profile;
