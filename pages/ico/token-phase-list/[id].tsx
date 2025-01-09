import CustomDataTable from "components/Datatable";
import Footer from "components/common/footer";
import PlaceBottomRight from "components/gradient/placeBottomRight";
import PlaceTopLeft from "components/gradient/placeTopLeft";
import LaunchpadHeader from "components/ico/LaunchpadHeader";
import LaunchpadSidebar from "layout/launchpad-sidebar";
import { SSRAuthCheck } from "middlewares/ssr-authentication-check";
import moment from "moment";
import { GetServerSideProps } from "next";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import { parseCookies } from "nookies";
import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { AiOutlineAppstoreAdd } from "react-icons/ai";
import { BsToggle2Off, BsToggle2On } from "react-icons/bs";
import { IoCreateOutline } from "react-icons/io5";
import { customPage, landingPage } from "service/landing-page";
import { SaveIcoPhaseStatus } from "service/launchpad";
import { IcoTokenPhaseListAction } from "state/actions/launchpad";
import { handleSwapHistorySearch } from "state/actions/reports";

const customStyles = {
  rows: {
    style: {
      minHeight: "72px", // override the row height
      // backgroundColor: "var(--glass-color-bg-1)",
    },
  },
  headCells: {
    style: {
      paddingLeft: "8px", // override the cell padding for head cells
      paddingRight: "8px",
      // backgroundColor: "var(--glass-color-bg-1)",
    },
  },
  cells: {
    style: {
      paddingLeft: "8px", // override the cell padding for data cells
      paddingRight: "8px",
    },
  },
};

const IcoTokenPhaseList = ({ id }: any) => {
  const [history, setHistory] = useState<any>([]);
  const { t } = useTranslation("common");
  const [search, setSearch] = useState<any>("");
  const [processing, setProcessing] = useState<boolean>(false);
  const [selectedLimit, setSelectedLimit] = useState<any>("10");
  const [sortingInfo, setSortingInfo] = useState<any>({
    column_name: "created_at",
    order_by: "desc",
  });
  const [stillHistory, setStillHistory] = useState<any>([]);
  const columns = [
    {
      Header: t("Phase title"),
      accessor: "phase_title",
      Cell: ({ row }: any) => (
        <div className="word-wrap-break-word white-space-break-spaces">
          <p>{row?.original?.phase_title}</p>
        </div>
      ),
      sortable: true,
    },
    {
      Header: t("Token name"),
      accessor: "coin_type",
      sortable: true,
    },
    {
      Header: t("Total Token Supply"),
      sortable: true,
      Cell: ({ row }: any) => (
        <div className="blance-text">
          {parseFloat(row?.original?.total_token_supply).toFixed(5)}{" "}
          {row?.original?.coin_type}
        </div>
      ),
    },
    {
      Header: t("Available Token Supply"),
      sortable: true,
      Cell: ({ row }: any) => (
        <div className="blance-text">
          {parseFloat(row?.original?.available_token_supply).toFixed(4)}{" "}
          {row?.original?.coin_type}
        </div>
      ),
    },
    {
      Header: t("Coin Price"),
      sortable: true,
      Cell: ({ row }: any) => (
        <div className="blance-text">
          {row?.original?.coin_price} {row?.original?.coin_currency}
        </div>
      ),
    },
    {
      Header: t("Status"),
      selector: ({ row }: any) => row?.status,
      sortable: true,
      Cell: ({ row }: any) => (
        <div className="position-relative">
          <li
            className="toolTip ml-3"
            title={row?.original?.status === 0 ? "Turn on" : "Turn off"}
            onClick={async () => {
              await SaveIcoPhaseStatus(row?.original?.id);
              await IcoTokenPhaseListAction(
                selectedLimit,
                1,
                setHistory,
                setProcessing,
                setStillHistory,
                sortingInfo.column_name,
                sortingInfo.order_by,
                id,
                search
              );
            }}
          >
            {row?.original?.status === 0 ? (
              <BsToggle2Off size={20} />
            ) : (
              <BsToggle2On size={20} />
            )}
          </li>
        </div>
      ),
    },
    {
      Header: t("Start Date"),
      Cell: ({ row }: any) =>
        moment(row?.original?.start_date).format("YYYY-MM-DD HH:mm:ss"),
      sortable: true,
    },
    {
      Header: t("End Date"),
      Cell: ({ row }: any) =>
        moment(row?.original?.end_date).format("YYYY-MM-DD HH:mm:ss"),
      sortable: true,
    },
    {
      Header: t("Actions"),
      sortable: true,
      Cell: ({ row }: any) => (
        <div className="blance-text">
          <Link href={`/ico/create-edit-phase/${row?.original?.id}?edit=true`}>
            <li
              className="toolTipForPhaseList d-inline-block position-relative cursor-pointer"
              title="Edit Phase"
            >
              <IoCreateOutline size={20} />
            </li>
          </Link>
          <Link href={`/ico/create-edit-additional-phase/${row?.original?.id}`}>
            <li
              className="toolTipForPhaseList ml-3 d-inline-block position-relative cursor-pointer"
              title="Add Edit Additional phase"
            >
              <AiOutlineAppstoreAdd size={20} />
            </li>
          </Link>
        </div>
      ),
    },
  ];
  const LinkTopaginationString = (page: any) => {
    const url = page.url.split("?")[1];
    const number = url.split("=")[1];
    IcoTokenPhaseListAction(
      selectedLimit,
      parseInt(number),
      setHistory,
      setProcessing,
      setStillHistory,
      sortingInfo.column_name,
      sortingInfo.order_by,
      id,
      search
    );
  };
  useEffect(() => {
    IcoTokenPhaseListAction(
      selectedLimit,
      1,
      setHistory,
      setProcessing,
      setStillHistory,
      sortingInfo.column_name,
      sortingInfo.order_by,
      id,
      search
    );
  }, [selectedLimit, search]);
  return (
    <>
      <div className="page-wrap">
        <div className="page-main-content">
          <LaunchpadHeader title={t("Token Phase List")} />
          <PlaceTopLeft />
          <PlaceBottomRight />
          <div className="container-4xl">
            <div className="asset-balances-area shadow-sm section-padding-custom wallet-card-info-container margin-n-top-60 margin-bottom-30">
              <div className="asset-balances-left">
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
                  <div
                    className="pagination-wrapper"
                    id="assetBalances_paginate"
                  >
                    <span>
                      {stillHistory?.links?.map((link: any, index: number) =>
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
                            className="paginate_button paginate-number"
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
  await SSRAuthCheck(ctx, "/user/profile");
  const { id, edit } = ctx.query;

  return {
    props: {
      id: id,
      edit: edit ? edit : null,
    },
  };
};
export default IcoTokenPhaseList;
