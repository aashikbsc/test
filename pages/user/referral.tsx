import Footer from "components/common/footer";
import Loading from "components/common/loading";
import PlaceBottomRight from "components/gradient/placeBottomRight";
import PlaceTopLeft from "components/gradient/placeTopLeft";
import MarketOverviewHeader from "components/markets/MarketOverviewHeader";
import { SSRAuthCheck } from "middlewares/ssr-authentication-check";
import type { GetServerSideProps, NextPage } from "next";
import useTranslation from "next-translate/useTranslation";
import { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import { getReferral } from "service/refer";

const Referral: NextPage = () => {
  const [referral, setReferral] = useState<any>();
  const [allData, setAllData] = useState<any>();
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation("common");
  const selectReference: any = useRef();

  useEffect(() => {
    getReferral().then((res) => {
      const code = res.data.data.url;
      setReferral(process.env.NEXT_PUBLIC_HOSTED_CLIENT_URL + "signup?" + code);
      setAllData(res.data.data);
      setLoading(false);
    });
    return () => {
      setReferral(null);
    };
  }, []);
  return (
    <>
      <MarketOverviewHeader title={t("Referrals")} />
      <div className="bg-primary-custom-color ">
        <PlaceTopLeft />
        <PlaceBottomRight />
        <div className="referral-area container-4xl ">
          <div className="margin-n-top-60 margin-bottom-30">
            <div className="invite-friends mb-5 shadow-sm  section-padding-custom wallet-card-info-container">
              <h4>{t("Invite your friends")}</h4>
              <div className="input-group rounded">
                <input
                  ref={selectReference}
                  onClick={() => {
                    navigator.clipboard.writeText(referral);
                    toast.success(t("Copied to clipboard"));
                    selectReference.current.select();
                  }}
                  type="url"
                  className="form-control referel-inputfield rounded-0"
                  id="url"
                  defaultValue={referral}
                  readOnly
                />
                <button
                  type="button"
                  className="btn copy-url-btn"
                  onClick={() => {
                    navigator.clipboard.writeText(referral);
                    toast.success(t("Copied to clipboard"));
                    selectReference.current.select();
                  }}
                >
                  <i className="fa fa-clone" />
                </button>
              </div>
            </div>
            <div className="section-wrapper shadow-sm  section-padding-custom wallet-card-info-container">
              <div className="rewards-inviter mb-25">
                <div className="single-item">
                  <h4>{t("Total Rewards")}</h4>
                  <h2>
                    {parseFloat(allData?.total_reward).toFixed(6)} <span />
                  </h2>
                </div>
                <div className="single-item">
                  <h4>{t("Total Invited")}</h4>
                  <h2>{allData?.count_referrals}</h2>
                </div>
              </div>
              <div className="referrals-table">
                <h4 className="section-title-medium font-bold">
                  {t("My Referrals")}
                </h4>
                <div className="table-responsive">
                  <table
                    className="table cp-user-custom-table table-borderless text-center dataTable no-footer"
                    id="DataTables_Table_0"
                  >
                    <thead>
                      <tr>
                        <th
                          className="referral-level text-left"
                          rowSpan={1}
                          colSpan={1}
                          aria-label="Level 1"
                        >
                          {t("Level 1")}
                        </th>
                        <th
                          className="referral-level text-left"
                          rowSpan={1}
                          colSpan={1}
                          aria-label="Level 2"
                        >
                          {t("Level 2")}
                        </th>
                        <th
                          className="referral-level text-right"
                          rowSpan={1}
                          colSpan={1}
                          aria-label="Level 3"
                        >
                          {t("Level 3")}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr id="" role="row referral" className="">
                        <td className="referral-text text-left">
                          {allData?.referralLevel[1]}
                        </td>
                        <td className="referral-text text-left">
                          {allData?.referralLevel[2]}
                        </td>
                        <td className="referral-text text-right">
                          {allData?.referralLevel[3]}
                        </td>
                      </tr>
                      {allData?.referralLevel.length == 0 && (
                        <td
                          colSpan={5}
                          className="text-center referral-text py-5"
                        >
                          <b>{t("No Data available")}</b>
                        </td>
                      )}

                      <tr>
                        <td colSpan={3} />
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="referrals-table">
                <h4 className="section-title-medium font-bold">
                  {t("My References")}
                </h4>
                <div className="table-responsive">
                  <table className="table dataTable cp-user-custom-table table-borderless text-center">
                    <thead>
                      <tr>
                        <th className="text-left">{t("Full Name")}</th>
                        <th className="text-left">{t("Email")}</th>
                        <th className="text-left">{t("Level")}</th>
                        <th className="text-right">{t("Joining Date")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allData?.referrals?.map((data: any, index: number) => (
                        <tr key={index}>
                          <td className="referral-text text-left">
                            {data?.full_name}
                          </td>
                          <td className="referral-text text-left">
                            {data?.email}
                          </td>
                          <td className="referral-text text-left">
                            {data?.level}
                          </td>
                          <td className="referral-text text-right">
                            {data?.joining_date}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              {/* <div className="my-earnings-table">
                <h4 className="section-title-medium font-bold">
                  {t("My Earnings")}
                </h4>
                <div className="table-responsive">
                  <table className="table dataTable cp-user-custom-table table-borderless text-center">
                    <thead>
                      <tr>
                        <th className="text-left">{t("Coin type")}</th>
                        <th className="text-left">{t("Amount")}</th>
                        <th className="text-left">{t("Transaction Id")}</th>
                        <th className="text-right">{t("Level")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allData?.monthlyEarningHistories?.map(
                        (data: any, index: number) => (
                          <tr key={index}>
                            <td className="text-left">{data?.coin_type}</td>
                            <td className="text-left">{data?.amount}</td>
                            <td className="text-left">
                              {data?.transaction_id}
                            </td>
                            <td className="text-right">{data?.level}</td>
                          </tr>
                        )
                      )}
                      {allData?.monthlyEarningHistories.length === 0 && (
                        <tr>
                          <td
                            colSpan={6}
                            className="text-center referral-text py-5"
                          >
                            <b>{t("No Data available")}</b>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div> */}
            </div>{" "}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};
export const getServerSideProps: GetServerSideProps = async (ctx: any) => {
  await SSRAuthCheck(ctx, "/user/referral");
  return {
    props: {},
  };
};

export default Referral;
