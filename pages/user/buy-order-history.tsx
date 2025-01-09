import type { GetServerSideProps, NextPage } from "next";
import ReportSidebar from "layout/report-sidebar";
import React, { useState } from "react";
import { SSRAuthCheck } from "middlewares/ssr-authentication-check";
import {
  AllBuyOrdersHistoryAction,
  handleSearchItems,
} from "state/actions/reports";
import TableLoading from "components/common/SectionLoading";
import useTranslation from "next-translate/useTranslation";
import moment from "moment";
import DataTable from "react-data-table-component";
import { formatCurrency } from "common";
import Footer from "components/common/footer";
import { customPage, landingPage } from "service/landing-page";
import { useSelector } from "react-redux";
import { RootState } from "state/store";
import CustomDataTable from "components/Datatable";
import ReportOverviewHeader from "components/reports/ReportOverviewHeader";
import PlaceTopLeft from "components/gradient/placeTopLeft";
import PlaceBottomRight from "components/gradient/placeBottomRight";

const BuyOrderHistory: NextPage = () => {
  type searchType = string;
  const { t } = useTranslation("common");
  const [search, setSearch] = useState<searchType>("");
  const [selectedLimit, setSelectedLimit] = useState<any>("10");
  const [sortingInfo, setSortingInfo] = useState<any>({
    column_name: "created_at",
    order_by: "desc",
  });
  const { settings } = useSelector((state: RootState) => state.common);
  const [processing, setProcessing] = useState<boolean>(false);
  const [history, setHistory] = useState<any>([]);
  const [stillHistory, setStillHistory] = useState<any>([]);
  const LinkTopaginationString = (page: any) => {
    const url = page.url.split("?")[1];
    const number = url.split("=")[1];
    AllBuyOrdersHistoryAction(
      selectedLimit,
      parseInt(number),
      setHistory,
      setProcessing,
      setStillHistory,
      sortingInfo.column_name,
      sortingInfo.order_by,
      search
    );
  };
  const getReport = async () => {
    AllBuyOrdersHistoryAction(
      selectedLimit,
      1,
      setHistory,
      setProcessing,
      setStillHistory,
      sortingInfo.column_name,
      sortingInfo.order_by,
      search
    );
  };

  const columns = [
    {
      Header: t("Base Coin"),
      accessor: "base_coin",
    },
    {
      Header: t("Trade Coin"),
      accessor: "trade_coin",
    },
    {
      Header: t("Amount"),
      accessor: "amount",
      Cell: ({ cell }: any) => (
        <div className="blance-text">
          <span className="blance market incree">
            {formatCurrency(cell?.value)}
          </span>
        </div>
      ),
    },
    {
      Header: t("Processed"),
      accessor: "processed",
      Cell: ({ cell }: any) => (
        <div className="blance-text">
          <span className="blance market incree">
            {parseFloat(cell?.value).toFixed(8)}
          </span>
        </div>
      ),
    },
    {
      Header: t("Price"),
      accessor: "price",
      Cell: ({ cell }: any) => (
        <div className="blance-text">
          <span className="blance market incree">
            {parseFloat(cell?.value).toFixed(8)}
          </span>
        </div>
      ),
    },
    {
      Header: t("Status"),
      accessor: "status",
      Cell: ({ cell }: any) => (
        <div>
          {cell.value === 0 ? (
            <span className="text-warning text-12">{t("Pending")}</span>
          ) : cell.value === 1 ? (
            <span className="text-success text-12"> {t("Success")}</span>
          ) : (
            <span className="text-danger text-12">{t("Failed")}</span>
          )}
        </div>
      ),
    },
    {
      Header: t("Date"),
      accessor: "created_at",
      Cell: ({ cell }: any) => (
        <div>{moment(cell.value).format("YYYY-MM-DD HH:mm:ss")}</div>
      ),
    },
  ];

  React.useEffect(() => {
    getReport();
    return () => {
      setHistory([]);
    };
  }, [selectedLimit, search]);
  return (
    <>
      <div>
        {/* <ReportSidebar /> */}
        <ReportOverviewHeader title={t("Buy Order History")} />
        <PlaceTopLeft />
        <PlaceBottomRight />
        <div className="page-main-content container-4xl">
          <div className="report-overview-body-padding margin-n-top-60 margin-bottom-30">
            <div className="asset-balances-area">
              <div className="asset-balances-left">
                <div>
                  <div className="tableScroll">
                    <div className=" table-responsive tableScroll">
                      <CustomDataTable
                        columns={columns}
                        data={history}
                        selectedLimit={selectedLimit}
                        setSelectedLimit={setSelectedLimit}
                        search={search}
                        setSearch={setSearch}
                        processing={processing}
                      />
                    </div>
                    {history?.length > 0 && (
                      <div
                        className="pagination-wrapper"
                        id="assetBalances_paginate"
                      >
                        <span>
                          {stillHistory?.items?.links.map(
                            (link: any, index: number) =>
                              link.label === "&laquo; Previous" ? (
                                <a
                                  className="paginate-button"
                                  onClick={() => {
                                    if (link.url) LinkTopaginationString(link);
                                  }}
                                  key={index}
                                >
                                  <i className="fa fa-angle-left"></i>
                                </a>
                              ) : link.label === "Next &raquo;" ? (
                                <a
                                  className="paginate-button"
                                  onClick={() => LinkTopaginationString(link)}
                                  key={index}
                                >
                                  <i className="fa fa-angle-right"></i>
                                </a>
                              ) : (
                                <a
                                  className={`paginate_button paginate-number ${
                                    link.active === true && "text-warning"
                                  }`}
                                  aria-controls="assetBalances"
                                  data-dt-idx="1"
                                  onClick={() => LinkTopaginationString(link)}
                                  key={index}
                                >
                                  {link.label}
                                </a>
                              )
                          )}
                        </span>
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
    </>
  );
};
export const getServerSideProps: GetServerSideProps = async (ctx: any) => {
  await SSRAuthCheck(ctx, "/user/buy-order-history");
  return {
    props: {},
  };
};

export default BuyOrderHistory;
