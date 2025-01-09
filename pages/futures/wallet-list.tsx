import { SSRAuthCheck } from "middlewares/ssr-authentication-check";
import type { GetServerSideProps, NextPage } from "next";
import React, { useEffect, useState } from "react";

import { SearchObjectArrayFuesJS } from "state/actions/wallet";
import Loading from "components/common/SectionLoading";
import Link from "next/link";
import useTranslation from "next-translate/useTranslation";
import Footer from "components/common/footer";
import { AiOutlineSend } from "react-icons/ai";
import { BsWallet2 } from "react-icons/bs";
import { getWalletsFutureAction } from "state/actions/futureTrade";
import CustomDataTable from "components/Datatable";
import moment from "moment";
import WalletOverviewSidebar from "layout/WalletOverviewSidebar";
import WalletOverviewHeader from "components/wallet-overview/WalletOverviewHeader";
import PlaceTopLeft from "components/gradient/placeTopLeft";
import PlaceBottomRight from "components/gradient/placeBottomRight";
const WalletList: NextPage = () => {
  const { t } = useTranslation("common");
  const [walletList, setWalletList] = useState<any>([]);
  const [search, setSearch] = useState<any>("");
  const [Changeable, setChangeable] = useState<any[]>([]);
  const [selectedLimit, setSelectedLimit] = useState<any>("10");
  const [processing, setProcessing] = useState<boolean>(false);
  const columns = [
    {
      Header: t("Asset"),

      Cell: ({ row }: any) => (
        <div className="asset d-flex align-items-center gap-10">
          <div className="overflow-hidden w-35 h-35 rounded-50p">
            <img
              className="asset-icon"
              src={row.original.coin_icon || "/bitcoin.png"}
              alt=""
              width={35}
              height={35}
            />
          </div>
          <div>
            <p className="asset-name">{row.original?.coin_type}</p>
            <p className="asset-name">{row.original?.wallet_name}</p>
          </div>
        </div>
      ),
    },
    {
      Header: t("Available Balance"),
      accessor: "balance",
      Cell: ({ cell }: any) => (
        <div className="blance-text">
          <span className="blance">{parseFloat(cell?.value).toFixed(8)}</span>
        </div>
      ),
    },
    {
      Header: t("Action"),
      Cell: ({ row }: any) => (
        <div className="active-link">
          <ul>
            <div className="active-link">
              <ul>
                <Link
                  href={`/futures/transfer-wallet/2/${row?.original?.coin_type}`}
                >
                  <li className="toolTip relative cursor-pointer" title="Send">
                    <AiOutlineSend />
                  </li>
                </Link>
                <Link
                  href={`/futures/transfer-wallet/1/${row?.original?.coin_type}`}
                >
                  <li
                    className="toolTip relative cursor-pointer"
                    title="Recieve"
                  >
                    <BsWallet2 />
                  </li>
                </Link>
              </ul>
            </div>
          </ul>
        </div>
      ),
    },
  ];
  const getWalletLists = async () => {
    setProcessing(true);
    const response: any = await getWalletsFutureAction(
      selectedLimit,
      1,
      search
    );
    setWalletList(response?.data);
    setChangeable(response?.data?.data);
    setProcessing(false);
  };

  const LinkTopaginationString = async (page: any) => {
    const url = page.url.split("?")[1];
    const number = url.split("=")[1];
    setProcessing(true);
    const response: any = await getWalletsFutureAction(
      selectedLimit,
      number,
      search
    );
    setWalletList(response?.data);
    setChangeable(response?.data?.data);
    setProcessing(false);
  };

  useEffect(() => {
    getWalletLists();
    return () => {
      setWalletList(null);
    };
  }, [selectedLimit, search]);
  return (
    <div>
      {" "}
      {/* <div className="page-wrap">
        <div className="page-main-content container-fluid">
          <div className="section-top-wrap mb-25">
            <div className="overview-area">
              <div className="overview-left">
                <h2 className="section-top-title">{t("Futures Wallet")}</h2>
              </div>
            </div>
          </div>
        </div>
      </div> */}
      <div className="page-wrap">
        {/* <WalletOverviewSidebar /> */}
        <div className="page-main-content pt-0">
          <div className="">
            <WalletOverviewHeader title={`Futures Wallet`} />
            <PlaceTopLeft />
            <PlaceBottomRight />
            <div className="row  container-4xl">
              <div className="col-md-12 px-0 margin-n-top-60 margin-bottom-30">
                <div className="asset-balances-area cstm-loader-area shadow-sm section-padding-custom wallet-card-info-container">
                  <div className="asset-balances-left">
                    <div className="section-wrapper px-0">
                      <div className="tableScroll pr-0">
                        <div className=" table-responsive">
                          <CustomDataTable
                            columns={columns}
                            data={Changeable}
                            selectedLimit={selectedLimit}
                            setSelectedLimit={setSelectedLimit}
                            search={search}
                            setSearch={setSearch}
                            processing={processing}
                            verticalAlignData={`middle`}
                          />
                          <div
                            className="pagination-wrapper"
                            id="assetBalances_paginate"
                          >
                            <span>
                              {walletList?.links?.map(
                                (link: any, index: number) =>
                                  link.label === "&laquo; Previous" ? (
                                    <a
                                      className="paginate-button"
                                      onClick={() =>
                                        LinkTopaginationString(link)
                                      }
                                      key={index}
                                    >
                                      <i className="fa fa-angle-left"></i>
                                    </a>
                                  ) : link.label === "Next &raquo;" ? (
                                    <a
                                      className="paginate-button"
                                      onClick={() =>
                                        LinkTopaginationString(link)
                                      }
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
                                      onClick={() =>
                                        LinkTopaginationString(link)
                                      }
                                      key={index}
                                    >
                                      {link.label}
                                    </a>
                                  )
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};
export const getServerSideProps: GetServerSideProps = async (ctx: any) => {
  await SSRAuthCheck(ctx, "/p2p");

  return {
    props: {},
  };
};

export default WalletList;
