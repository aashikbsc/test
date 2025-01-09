import Footer from "components/common/footer";
import SectionLoading from "components/common/SectionLoading";
import { P2pDataTable } from "components/P2P/P2pHome/P2pDataTable";
import { P2pFilter } from "components/P2P/P2pHome/P2pFilter";
import { P2pTopBar } from "components/P2P/P2pHome/TopBar";
import { BUY } from "helpers/core-constants";
import { SSRAuthCheck } from "middlewares/ssr-authentication-check";
import { GetServerSideProps } from "next";
import useTranslation from "next-translate/useTranslation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { myP2pOrderAction, userAdsFilterChangeAction } from "state/actions/p2p";
import { RootState } from "state/store";

const P2pOrder = () => {
  const adsType = 1;
  const [settings, setSettings] = useState<any>([]);
  const { isLoggedIn } = useSelector((state: RootState) => state.user);
  const { t } = useTranslation("common");

  const [filters, setFilters] = useState({
    type: BUY,
    amount: 0,
    coin: "all",
    currency: "all",
    payment_method: "all",
    country: "all",
    per_page: 5,
    page: 1,
    status: "all",
  });
  const [processing, setProcessing] = useState<boolean>(false);
  const [history, setHistory] = useState<any>([]);
  const [stillHistory, setStillHistory] = useState<any>([]);
  const LinkTopaginationString = (page: any) => {
    const url = page.url.split("?")[1];
    const number = url.split("=")[1];
    userAdsFilterChangeAction(
      filters.type,
      filters.amount,
      filters.coin,
      filters.currency,
      filters.payment_method,
      filters.status,
      filters.country,
      filters.per_page,
      parseInt(number),
      setHistory,
      setProcessing,
      setStillHistory,
      setSettings
    );
  };
  useEffect(() => {
    userAdsFilterChangeAction(
      filters.type,
      filters.amount,
      filters.coin,
      filters.currency,
      filters.payment_method,
      filters.status,
      filters.country,
      filters.per_page,
      1,
      setHistory,
      setProcessing,
      setStillHistory,
      setSettings
    );
  }, [filters]);
  return (
    <>
      <div className="">
        <div className="my-0 wallet-overview-header-main bg_cover_dashboard">
          <div className="profle-are-top container-4xl">
            <h2 className="wallet-overview-header-title text-center">
              {t(`My Buy Order History`)}
            </h2>
          </div>
        </div>
        <P2pTopBar />

        <>
          {/* <P2pFilter
            setFilters={setFilters}
            filters={filters}
            settings={settings}
          /> */}
          {processing ? (
            <div className="glass-color-bg-custom">
              <SectionLoading />
            </div>
          ) : (
            <P2pDataTable
              history={history}
              filters={filters}
              isLoggedIn={isLoggedIn}
              action={false}
              payment={false}
              edit={true}
              adsType={adsType}
              statusChange={true}
              deleteBtn={true}
            />
          )}

          {history?.length > 0 && (
            <div
              className="pagination-wrapper glass-color-bg-custom mt-0 pt-3 pb-5"
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
        </>
      </div>
      <Footer />
    </>
  );
};
export const getServerSideProps: GetServerSideProps = async (ctx: any) => {
  await SSRAuthCheck(ctx, "/p2p");

  return {
    props: {},
  };
};
export default P2pOrder;
