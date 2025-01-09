import SectionLoading from "components/common/SectionLoading";
import Footer from "components/common/footer";
import PlaceBottomRight from "components/gradient/placeBottomRight";
import PlaceTopLeft from "components/gradient/placeTopLeft";
import LaunchpadHeader from "components/ico/LaunchpadHeader";
import LaunchpadSidebar from "layout/launchpad-sidebar";
import { SSRAuthCheck } from "middlewares/ssr-authentication-check";
import { GetServerSideProps } from "next";
import useTranslation from "next-translate/useTranslation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { customPage, landingPage } from "service/landing-page";
import { getTokenWithdrawPrice, withDrawMoney } from "service/launchpad";
import { getEarningDetailsAction } from "state/actions/launchpad";

const Withdraw = () => {
  const { t } = useTranslation("common");
  const [loading, setLoading]: any = useState<any>(false);
  const [data, setData]: any = useState<any>();
  const [amount, setamount]: any = useState<any>();
  const [amountInfo, setAmountInfo] = useState<any>();
  const [selectedCurrency, setSelectedCurrency] = useState<any>();
  const [currencyFiat, setCurrencyFiat]: any = useState<any>();
  const [currencyCoin, setCurrencyCoin]: any = useState<any>();
  const [currencyType, setCurrencyType]: any = useState<any>();
  const [paymentDetails, setPaymentDetails] = useState<any>("");

  const getTokenwithdrawPrice = async () => {
    if (amount && currencyType && selectedCurrency) {
      const payload = {
        amount,
        currency_type: currencyType,
        currency_to: selectedCurrency,
      };
      const response = await getTokenWithdrawPrice(payload);
      setAmountInfo(response);
    }
  };
  const withDrawMoneyApi = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    if (amount && currencyType && selectedCurrency) {
      let payload: any = {
        amount,
        currency_type: currencyType,
        currency_to: selectedCurrency,
      };
      if (currencyType == 1) {
        payload = {
          ...payload,
          payment_details: paymentDetails,
        };
      }
      const response = await withDrawMoney(payload);
      setLoading(false);

      if (response.success === true) {
        toast.success(response.message);
        getTokenwithdrawPrice();
      } else {
        toast.error(response.message);
        setCurrencyType("");
        getTokenwithdrawPrice();
      }
    }
  };
  // ;
  useEffect(() => {
    getTokenwithdrawPrice();
  }, [currencyType, amount, selectedCurrency]);
  useEffect(() => {
    getEarningDetailsAction(setLoading, setData);
  }, []);
  return (
    <>
      <div className="page-wrap rightMargin">
        {/* <LaunchpadSidebar /> */}
        <div className="page-main-content">
          <LaunchpadHeader title={t("Withdraw")} />
          <PlaceTopLeft />
          <PlaceBottomRight />
          <div className="container-4xl">
            <div className="asset-balances-area cstm-loader-area shadow-sm section-padding-custom wallet-card-info-container margin-n-top-60 margin-bottom-30">
              <div className="asset-balances-left">
                <div className="section-wrapper">
                  {loading ? (
                    <div className="mt-4">
                      <SectionLoading />
                    </div>
                  ) : (
                    <>
                      <div className="row p-3 p-md-0">
                        <div className="col-md-4 col-sm-6">
                          <div className="boxShadow text-center py-5 px-4 shadow-sm">
                            <div className="d-flex justify-content-center">
                              <span className="card-top-icon mb-3">
                                <i
                                  className="fa fa-ticket"
                                  aria-hidden="true"
                                ></i>
                              </span>
                            </div>
                            <h2>
                              {data?.earns?.earn} {data?.earns?.currency}
                            </h2>
                            <h4 className="mt-2 font_size">
                              {t("Total Earned")}
                            </h4>
                          </div>
                        </div>
                        <div className="col-md-4 col-sm-6 mt-4 mt-sm-0">
                          <div className="boxShadow text-center py-5 px-4 shadow-sm">
                            <div className="d-flex justify-content-center">
                              <span className="card-top-icon mb-3">
                                <i
                                  className="fa fa-ticket"
                                  aria-hidden="true"
                                ></i>
                              </span>
                            </div>
                            <h2>
                              {data?.earns?.withdraw} {data?.earns?.currency}
                            </h2>
                            <h4 className="mt-2 font_size">
                              {t("Withdrawal Amount")}
                            </h4>
                          </div>
                        </div>

                        <div className="col-md-4 col-sm-6 mt-4 mt-md-0">
                          <div className="boxShadow text-center py-5 px-2 px-md-4 shadow-sm">
                            <div className="d-flex justify-content-center">
                              <span className="card-top-icon mb-3">
                                <i
                                  className="fa fa-ticket"
                                  aria-hidden="true"
                                ></i>
                              </span>
                            </div>
                            <h2>
                              {data?.earns?.available} {data?.earns?.currency}
                            </h2>
                            <h4 className="mt-2 font_size">
                              {t("Available Amount")}
                            </h4>
                          </div>
                        </div>
                      </div>

                      <form onSubmit={withDrawMoneyApi}>
                        <div className=" mt-5 row">
                          <div className="col-md-6 form-input-div">
                            <label className="ico-label-box" htmlFor="">
                              {t("Amount")}
                            </label>
                            <input
                              type="number"
                              name="amount"
                              required
                              onChange={(e) => {
                                setamount(e.target.value);
                              }}
                              className={`ico-input-box`}
                            />
                            {amountInfo?.success ? (
                              <p>
                                {amountInfo?.data?.amount}{" "}
                                {amountInfo?.data?.currency_from} ={" "}
                                {amountInfo?.data?.price}{" "}
                                {amountInfo?.data?.currency_to}
                              </p>
                            ) : (
                              <p>{amountInfo?.message}</p>
                            )}
                          </div>
                          <div className="col-md-6 form-input-div">
                            <label className="ico-label-box" htmlFor="">
                              {t("Currency Type")}
                            </label>
                            <div className="cp-select-area">
                              <select
                                name="coin_currency"
                                className={`ico-input-box`}
                                required
                                onChange={(e: any) => {
                                  setPaymentDetails("");
                                  setCurrencyType(e.target.value);
                                  setSelectedCurrency("");
                                  if (parseInt(e.target.value) === 1) {
                                    setCurrencyFiat(data?.currencys);
                                  } else {
                                    setCurrencyCoin(data?.coins);
                                  }
                                }}
                              >
                                <option value="">
                                  {t("Select Currency Type")}
                                </option>
                                <option value={1}>{t("Fiat")}</option>
                                <option value={2}>{t("Crypto")}</option>
                              </select>
                            </div>
                          </div>
                          {currencyType == 1 && (
                            <div className="col-md-6 form-input-div">
                              <label className="ico-label-box" htmlFor="">
                                {t("Currency List")}
                              </label>

                              <select
                                name="coin_currency"
                                className={`ico-input-box`}
                                required
                                onChange={(e) => {
                                  setSelectedCurrency(e.target.value);
                                }}
                              >
                                <option value="">{t("Select currency")}</option>
                                {currencyFiat.map((item: any, index: any) => (
                                  <option value={item.code} key={index}>
                                    {item.name}
                                  </option>
                                ))}
                              </select>
                            </div>
                          )}

                          {currencyType == 2 && (
                            <div className="col-md-6 form-input-div">
                              <label className="ico-label-box" htmlFor="">
                                {t("Currency List")}
                              </label>

                              <select
                                name="coin_currency"
                                className={`ico-input-box`}
                                required
                                onChange={(e) => {
                                  setSelectedCurrency(e.target.value);
                                }}
                              >
                                <option value="">{t("Select currency")}</option>
                                {currencyCoin?.map((item: any, index: any) => (
                                  <option value={item.coin_type} key={index}>
                                    {item.coin_type}
                                  </option>
                                ))}
                              </select>
                            </div>
                          )}
                          {currencyType == 1 && (
                            <div className="col-md-6 form-input-div">
                              <label
                                className="ico-label-box"
                                htmlFor="payment_details"
                              >
                                {t("Payment Details")}
                              </label>

                              <textarea
                                name="payment_details"
                                id="payment_details"
                                className={`ico-input-box`}
                                required
                                onChange={(e) => {
                                  setPaymentDetails(e.target.value);
                                }}
                              ></textarea>
                            </div>
                          )}
                          <div className="col-md-12 form-input-div">
                            <button type="submit" className="primary-btn">
                              {loading ? t("Please Wait..") : t("Withdraw")}
                            </button>
                          </div>
                        </div>
                      </form>
                    </>
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
export default Withdraw;
