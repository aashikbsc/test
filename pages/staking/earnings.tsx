import StakingHeader from "components/Staking/StakingHeader";
import { StakingTopBar } from "components/Staking/common/TopBar";
import { SSRAuthCheck } from "middlewares/ssr-authentication-check";
import { GetServerSideProps } from "next";
import useTranslation from "next-translate/useTranslation";
import React, { useEffect, useState } from "react";
import { earningsAction } from "state/actions/staking";

const Earnings = () => {
  const [statsDetails, setStatsDetails] = useState<any>();
  const { t } = useTranslation();
  useEffect(() => {
    earningsAction(setStatsDetails);
  }, []);
  return (
    <div>
      <StakingHeader title={t("My Earnings")} />
      <div className="container-4xl margin-n-top-60 margin-bottom-30">
        <div className=" row ">
          <div className="col-md-6 col-12 mt-3">
            <div className="shadow-sm section-padding-custom wallet-card-info-container ">
              <h5>{t("Total Investment")}</h5>
              {statsDetails?.total_investment.length === 0 ? (
                <p className="p-5 boxShadow text-center mt-3">
                  {t("No data available")}
                </p>
              ) : (
                <table className="table mt-4">
                  <thead>
                    <tr>
                      <th scope="col">{t("Coin Type")}</th>
                      <th scope="col">{t("Total Bonus")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {statsDetails?.total_investment?.map(
                      (item: any, index: any) => (
                        <tr className="tableRow" key={index}>
                          <td>
                            <div className="tableImg d-flex align-items-center">
                              <h6 className="">{item?.coin_type}</h6>
                            </div>
                          </td>
                          <td>
                            <h6 className="mx-2">
                              {parseFloat(item?.total_investment)}
                            </h6>
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          <div className="col-md-6 col-12 mt-3">
            <div className="shadow-sm section-padding-custom wallet-card-info-container ">
              <h5>{t("Disputed Investment")}</h5>
              {statsDetails?.total_paid_investment.length === 0 ? (
                <p className="p-5 boxShadow text-center mt-3">
                  {t("No data available")}
                </p>
              ) : (
                <table className="table mt-4">
                  <thead>
                    <tr>
                      <th scope="col">{t("Coin Type")}</th>
                      <th scope="col">{t("Total Bonus")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {statsDetails?.total_paid_investment?.map(
                      (item: any, index: any) => (
                        <tr className="tableRow" key={index}>
                          <td>
                            <div className="tableImg d-flex align-items-center">
                              <h6 className="">{item?.coin_type}</h6>
                            </div>
                          </td>
                          <td>
                            <h6 className="mx-2">
                              {parseFloat(item?.total_investment)}
                            </h6>
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
          <div className="col-md-6 col-12 mt-3">
            <div className="shadow-sm section-padding-custom wallet-card-info-container ">
              <h5>{t("Total Running Investment")}</h5>
              {statsDetails?.total_running_investment.length === 0 ? (
                <p className="p-5 boxShadow text-center mt-3">
                  {t("No data available")}
                </p>
              ) : (
                <table className="table mt-4">
                  <thead>
                    <tr>
                      <th scope="col">{t("Coin Type")}</th>
                      <th scope="col">{t("Total Bonus")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {statsDetails?.total_running_investment?.map(
                      (item: any, index: any) => (
                        <tr className="tableRow" key={index}>
                          <td>
                            <div className="tableImg d-flex align-items-center">
                              <h6 className="">{item?.coin_type}</h6>
                            </div>
                          </td>
                          <td>
                            <h6 className="mx-2">
                              {parseFloat(item?.total_investment)}
                            </h6>
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
          <div className="col-md-6 col-12 mt-3">
            <div className="shadow-sm section-padding-custom wallet-card-info-container ">
              <h5>{t("Total Dispributable Investment")}</h5>
              {statsDetails?.total_unpaid_investment.length === 0 ? (
                <p className="p-5 boxShadow text-center mt-3">
                  {t("No data available")}
                </p>
              ) : (
                <table className="table mt-4">
                  <thead>
                    <tr>
                      <th scope="col">{t("Coin Type")}</th>
                      <th scope="col">{t("Total Bonus")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {statsDetails?.total_unpaid_investment?.map(
                      (item: any, index: any) => (
                        <tr className="tableRow" key={index}>
                          <td>
                            <div className="tableImg d-flex align-items-center">
                              <h6 className="">{item?.coin_type}</h6>
                            </div>
                          </td>
                          <td>
                            <h6 className="mx-2">
                              {parseFloat(item?.total_investment)}
                            </h6>
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
          <div className="col-md-6 col-12 mt-3">
            <div className="shadow-sm section-padding-custom wallet-card-info-container ">
              <h5>{t("Total Investment Cancelled")}</h5>
              {statsDetails?.total_cancel_investment.length === 0 ? (
                <p className="p-5 boxShadow text-center mt-3">
                  {t("No data available")}
                </p>
              ) : (
                <table className="table mt-4">
                  <thead>
                    <tr>
                      <th scope="col">{t("Coin Type")}</th>
                      <th scope="col">{t("Total Bonus")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {statsDetails?.total_cancel_investment?.map(
                      (item: any, index: any) => (
                        <tr className="tableRow" key={index}>
                          <td>
                            <div className="tableImg d-flex align-items-center">
                              <h6 className="">{item?.coin_type}</h6>
                            </div>
                          </td>
                          <td>
                            <h6 className="mx-2">
                              {parseFloat(item?.total_investment)}
                            </h6>
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export const getServerSideProps: GetServerSideProps = async (ctx: any) => {
  await SSRAuthCheck(ctx, "/staking");

  return {
    props: {},
  };
};
export default Earnings;
