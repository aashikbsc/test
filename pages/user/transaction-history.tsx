import type { GetServerSideProps, NextPage } from "next";
import ReportSidebar from "layout/report-sidebar";
import React, { useState } from "react";
import { SSRAuthCheck } from "middlewares/ssr-authentication-check";
import {
  AllTransactionHistoryAction,
  handleSearchItems,
} from "state/actions/reports";
import TableLoading from "components/common/SectionLoading";
import useTranslation from "next-translate/useTranslation";
import moment from "moment";
import DataTable from "react-data-table-component";
import { formatCurrency } from "common";
import Footer from "components/common/footer";
import CustomDataTable from "components/Datatable";
import ReportOverviewHeader from "components/reports/ReportOverviewHeader";
import PlaceBottomRight from "components/gradient/placeBottomRight";
import PlaceTopLeft from "components/gradient/placeTopLeft";
const TransactionHistory: NextPage = () => {
  const { t } = useTranslation("common");
  type searchType = string;
  const [search, setSearch] = useState<searchType>("");
  const [processing, setProcessing] = useState<boolean>(false);
  const [history, setHistory] = useState<any>([]);
  const [stillHistory, setStillHistory] = useState<any>([]);
  const [selectedLimit, setSelectedLimit] = useState<any>("10");
  const LinkTopaginationString = (page: any) => {
    const url = page.url.split("?")[1];
    const number = url.split("=")[1];
    AllTransactionHistoryAction(
      selectedLimit,
      parseInt(number),
      setHistory,
      setProcessing,
      setStillHistory,
      search
    );
  };
  const getReport = async () => {
    AllTransactionHistoryAction(
      selectedLimit,
      1,
      setHistory,
      setProcessing,
      setStillHistory,
      search
    );
  };
  const columns = [
    {
      Header: t("Transaction Id"),
      accessor: "transaction_id",
    },
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
    },
    {
      Header: t("Price"),
      accessor: "price",
    },
    {
      Header: t("Fees"),
      accessor: "fees",
    },
    {
      Header: t("Date"),
      accessor: "time",
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
        <ReportOverviewHeader title={t("Transaction History")} />
        <PlaceTopLeft />
        <PlaceBottomRight />
        <div className="page-main-content container-4xl">
          <div className="report-overview-body-padding margin-n-top-60 margin-bottom-30">
            <div className="asset-balances-area">
              <div className="asset-balances-left">
                <div>
                  <div className="tableScroll">
                    <CustomDataTable
                      columns={columns}
                      data={history}
                      stillHistory={stillHistory}
                      paginateFunction={LinkTopaginationString}
                      setSelectedLimit={setSelectedLimit}
                      selectedLimit={selectedLimit}
                      search={search}
                      setSearch={setSearch}
                      processing={processing}
                    />
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
  await SSRAuthCheck(ctx, "/user/transaction-history");
  return {
    props: {},
  };
};

export default TransactionHistory;
