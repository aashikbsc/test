import { SSRAuthCheck } from "middlewares/ssr-authentication-check";
import type { GetServerSideProps, NextPage } from "next";
import { toast } from "react-toastify";
import React, { useEffect, useState } from "react";
import { IoWalletOutline } from "react-icons/io5";
import { TiArrowRepeat } from "react-icons/ti";
import { getMyTokenBalanceAction } from "state/actions/launchpad";
import Loading from "components/common/SectionLoading";
import useTranslation from "next-translate/useTranslation";
import Footer from "components/common/footer";
import { customPage, landingPage } from "service/landing-page";
import LaunchpadSidebar from "layout/launchpad-sidebar";
import SectionLoading from "components/common/SectionLoading";
import LaunchpadHeader from "components/ico/LaunchpadHeader";
import PlaceTopLeft from "components/gradient/placeTopLeft";
import PlaceBottomRight from "components/gradient/placeBottomRight";
import moment from "moment";
import CustomDataTable from "components/Datatable";

const MyWallet: NextPage = () => {
  const [history, setHistory] = useState<any>([]);
  const { t } = useTranslation("common");
  const columns = [
    {
      Header: t("Asset"),
      accessor: "name",
      Cell: ({ row }: any) => (
        <div className="asset">
          <img
            className="asset-icon"
            src={row?.original?.image_path || "/bitcoin.png"}
            alt=""
          />
          <span className="asset-name pl-2">{row?.original?.name}</span>
        </div>
      ),
    },

    {
      Header: t("Symbol"),
      Cell: ({ row }: any) => (
        <span className="symbol">{row?.original?.coin_type}</span>
      ),
    },
    {
      Header: t("Available Balance"),
      Cell: ({ row }: any) => (
        <div className="blance-text">
          <span className="blance">
            {parseFloat(row?.original?.balance).toFixed(8)}
          </span>
        </div>
      ),
    },

    {
      Header: t("Address"),
      accessor: "address",
    },

    {
      Header: t("Date"),
      accessor: "created_at",
      Cell: ({ cell }: any) => moment(cell.value).format("YYYY-MM-DD HH:mm:ss"),
    },
  ];
  const [search, setSearch] = useState<any>("");
  const [selectedLimit, setSelectedLimit] = useState<any>("10");
  const [processing, setProcessing] = useState<boolean>(false);
  const [sortingInfo, setSortingInfo] = useState<any>({
    column_name: "created_at",
    order_by: "desc",
  });
  const [stillHistory, setStillHistory] = useState<any>([]);

  const LinkTopaginationString = (page: any) => {
    const url = page.url.split("?")[1];
    const number = url.split("=")[1];
    getMyTokenBalanceAction(
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
  useEffect(() => {
    getMyTokenBalanceAction(
      selectedLimit,
      1,
      setHistory,
      setProcessing,
      setStillHistory,
      sortingInfo.column_name,
      sortingInfo.order_by,
      search
    );
  }, [selectedLimit, search]);
  return (
    <>
      <div className="page-wrap rightMargin">
        {/* <LaunchpadSidebar /> */}
        <div className="page-main-content">
          <LaunchpadHeader title={t("Token Wallet")} />
          <PlaceTopLeft />
          <PlaceBottomRight />
          <div className="container-4xl">
            <div className="asset-balances-area cstm-loader-area shadow-sm  wallet-card-info-container margin-n-top-60 margin-bottom-30">
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
                    />
                  </div>
                  {history.length > 0 && (
                    <div
                      className="pagination-wrapper"
                      id="assetBalances_paginate"
                    >
                      <span>
                        {stillHistory?.links?.map((link: any, index: number) =>
                          link.label === "&laquo; Previous" ? (
                            <a
                              className="paginate-button"
                              onClick={() => LinkTopaginationString(link)}
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
      <Footer />
    </>
  );
};
export const getServerSideProps: GetServerSideProps = async (ctx: any) => {
  await SSRAuthCheck(ctx, "/user/my-wallet");

  return {
    props: {},
  };
};

export default MyWallet;
