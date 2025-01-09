import type { GetServerSideProps, NextPage } from "next";
import ProfileComp from "components/profile/profile";
import { parseCookies } from "nookies";

import { GetUserInfoByTokenServer } from "service/user";
import ProfileSidebar from "layout/profile-sidebar";
import { SSRAuthCheck } from "middlewares/ssr-authentication-check";
import useTranslation from "next-translate/useTranslation";
import Footer from "components/common/footer";
import { customPage, landingPage } from "service/landing-page";
import moment from "moment";
import LaunchpadSidebar from "layout/launchpad-sidebar";
import { useEffect, useState } from "react";
import { DynamicSubmittedFormListAction } from "state/actions/launchpad";
import TableLoading from "components/common/SectionLoading";
import DataTable from "react-data-table-component";
import { handleSwapHistorySearch } from "state/actions/reports";
import Link from "next/link";
import { IoWalletOutline } from "react-icons/io5";
import { GiToken } from "react-icons/gi";
import SectionLoading from "components/common/SectionLoading";
import LaunchpadHeader from "components/ico/LaunchpadHeader";
import PlaceTopLeft from "components/gradient/placeTopLeft";
import PlaceBottomRight from "components/gradient/placeBottomRight";
import CustomDataTable from "components/Datatable";
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

const Profile: NextPage = () => {
  const [history, setHistory] = useState<any>([]);
  const [selectedLimit, setSelectedLimit] = useState<any>("10");

  const { t } = useTranslation("common");
  const [search, setSearch] = useState<any>("");
  const [processing, setProcessing] = useState<boolean>(false);
  const [sortingInfo, setSortingInfo] = useState<any>({
    column_name: "created_at",
    order_by: "desc",
  });
  const [stillHistory, setStillHistory] = useState<any>([]);
  const columns = [
    {
      Header: t("Id"),
      Cell: ({ row }: any) => row?.original?.unique_id,
      sortable: true,
    },
    {
      Header: t("Updated At"),
      Cell: ({ row }: any) => row?.original?.updated_at,
      sortable: true,
    },

    {
      Header: t("Status"),
      sortable: true,
      Cell: ({ row }: any) => (
        <div>
          {row.original?.status === 0 ? (
            <span className="text-warning">{t("Pending")}</span>
          ) : row.original?.status === 1 ? (
            <span className="text-success"> {t("Success")}</span>
          ) : (
            <span className="text-danger">{t("Failed")}</span>
          )}
        </div>
      ),
    },
    {
      Header: t("Date"),
      Cell: ({ row }: any) =>
        moment(row.original?.created_at).format("YYYY-MM-DD HH:mm:ss"),
      sortable: true,
    },
    {
      Header: t("Actions"),
      sortable: true,
      Cell: ({ row }: any) => (
        <div className="blance-text">
          {row?.original?.status === 1 &&
            row?.original?.token_create_status === 1 && (
              <Link href={`/ico/create-edit-token/${row?.original?.id}`}>
                <li
                  className="toolTipForPhaseList d-inline-block position-relative cursor-pointer"
                  title="Create Token"
                >
                  <GiToken size={25} />
                </li>
              </Link>
            )}
        </div>
      ),
    },
  ];
  const LinkTopaginationString = (page: any) => {
    const url = page.url.split("?")[1];
    const number = url.split("=")[1];
    DynamicSubmittedFormListAction(
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
    DynamicSubmittedFormListAction(
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
      <div className="page-wrap">
        {/* <LaunchpadSidebar /> */}
        <div className="page-main-content">
          <LaunchpadHeader title={t("Applied launchpad")} />
          <PlaceTopLeft />
          <PlaceBottomRight />
          <div className="container-4xl">
            {/* <div className="section-top-wrap mb-25 inner-section-margin-top">
              <div className="profle-are-top">
                <h2 className="section-top-title">{t("Applied launchpad")}</h2>
              </div>
            </div> */}
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
                      isSearchable={false}
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
      </div>
      <Footer />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx: any) => {
  await SSRAuthCheck(ctx, "/user/profile");
  const cookies = parseCookies(ctx);
  const response = await GetUserInfoByTokenServer(cookies.token);

  return {
    props: {
      user: response.user,
      profileActivity: response.activityLog,
    },
  };
};
export default Profile;
