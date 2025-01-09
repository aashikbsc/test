import { formateData } from "common";
import { NoItemFound } from "components/NoItemFound/NoItemFound";
import StakingHeader from "components/Staking/StakingHeader";
import { StakingTopBar } from "components/Staking/common/TopBar";
import SectionLoading from "components/common/SectionLoading";
import Footer from "components/common/footer";
import useTranslation from "next-translate/useTranslation";
import { useEffect, useState } from "react";
import { GetPaymentListAction } from "state/actions/staking";

const PaymentList = ({}: any) => {
  const [processing, setProcessing] = useState<boolean>(false);
  const { t } = useTranslation();
  const [history, setHistory] = useState<any>([]);
  const [stillHistory, setStillHistory] = useState<any>([]);
  const LinkTopaginationString = (page: any) => {
    const url = page.url.split("?")[1];
    const number = url.split("=")[1];
    GetPaymentListAction(
      5,
      parseInt(number),
      setHistory,
      setProcessing,
      setStillHistory
    );
  };

  useEffect(() => {
    GetPaymentListAction(5, 1, setHistory, setProcessing, setStillHistory);
  }, []);

  return (
    <>
      <div className="page-wrap">
        <div className="page-main-content">
          <StakingHeader title={t("My Earnings")} />
          <div className="container-4xl margin-n-top-60 margin-bottom-30">
            {processing ? (
              <SectionLoading />
            ) : (
              <div className="row">
                <div className="col-12">
                  <div className="table-responsive shadow-sm section-padding-custom wallet-card-info-container ">
                    <table className="table mt-4">
                      <thead>
                        <tr>
                          <th scope="col">{t("Coin Type")}</th>
                          <th scope="col">{t("Payment Date")}</th>
                          <th scope="col">{t("Total Amount")}</th>
                          <th scope="col">{t("Total Interest")}</th>
                          <th scope="col">{t("Total Invested")}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {history?.length > 0 &&
                          history?.map((item: any, index: any) => (
                            <tr className="tableRow" key={index}>
                              <td>
                                <div className="tableImg d-flex align-items-center">
                                  <h6 className="">{item?.coin_type}</h6>
                                </div>
                              </td>
                              <td>
                                <h6 className="mx-2">
                                  {formateData(item.created_at)}
                                </h6>
                              </td>
                              <td>{item?.total_amount}</td>
                              <td>{item?.total_bonus}</td>
                              <td>{item?.total_investment}</td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                    {history?.length == 0 && <NoItemFound />}
                    {history?.length > 0 && (
                      <div
                        className="pagination-wrapper"
                        id="assetBalances_paginate"
                      >
                        <span>
                          {stillHistory?.links?.map(
                            (link: any, index: number) =>
                              link.label === "&laquo; Previous" ? (
                                <a
                                  key={index}
                                  className="paginate-button"
                                  onClick={() => {
                                    if (link.url) LinkTopaginationString(link);
                                  }}
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
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};
export default PaymentList;
