import SectionLoading from "components/common/SectionLoading";
import Footer from "components/common/footer";
import { SSRAuthCheck } from "middlewares/ssr-authentication-check";
import { GetServerSideProps } from "next";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { BiArrowBack } from "react-icons/bi";
import {
  checkCoinTransactionDepositApi,
  getCoinListsForCheckDeposit,
  getNetworkListsForCheckDeposit,
} from "service/user";

export default function CheckDeposit() {
  const { t } = useTranslation();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState<any>(false);
  const [isLoading, setIsLoading] = useState<any>(false);
  const [networkLists, setNetworkLists] = useState([]);
  const [selectedNetwork, setSelectedNetwork] = useState<any>("");
  const [coinLists, setCoinLists] = useState<any>([]);
  const [selectedCoin, setSelectedCoin] = useState<any>("");
  const [transactionId, setTransactionId] = useState<any>("");
  const [depositInfo, setDepositInfo] = useState<any>({});
  useEffect(() => {
    getNetworkLists();
  }, []);

  const getNetworkLists = async () => {
    setIsLoading(true);
    const response = await getNetworkListsForCheckDeposit();
    if (!response?.success) {
      toast.error(response.message);
      setIsLoading(false);
      return;
    }
    setNetworkLists(response.data);
    setIsLoading(false);
  };

  const getCoinLists = async (event: any) => {
    setCoinLists([]);
    setSelectedCoin("");
    if (!event.target.value) {
      setSelectedNetwork(event.target.value);
      return;
    }

    setSelectedNetwork(event.target.value);
    const response = await getCoinListsForCheckDeposit(event.target.value);
    if (!response?.success) {
      toast.error(response.message);
      return;
    }
    setCoinLists(response.data);
  };

  const handleCheckDeposit = async () => {
    if (!selectedNetwork) {
      toast.error("Please select a network");
      return;
    }
    if (!selectedCoin) {
      toast.error("Please select a coin");
      return;
    }

    if (!transactionId) {
      toast.error("Please enter transaction ID");
      return;
    }
    setIsProcessing(true);

    let value = {
      coin_id: Number(selectedCoin),
      network_id: Number(selectedNetwork),
      trx_id: transactionId,
    };
    setIsModalOpen(true);
    const response = await checkCoinTransactionDepositApi(value);

    if (!response?.success) {
      toast.error(response?.message);
      setIsProcessing(false);
      setIsModalOpen(false);
      return;
    }
    setDepositInfo(response);
    setSelectedCoin("");
    setSelectedNetwork("");
    setTransactionId("");
    setIsProcessing(false);
  };

  return (
    <div>
      <div className="mb-5 pb-5">
        <div className="my-0 wallet-overview-header-main bg_cover_dashboard">
          <div className="profle-are-top container-4xl">
            <h2 className="wallet-overview-header-title text-center">
              Check Deposit
            </h2>
          </div>
        </div>
        {isLoading ? (
          <SectionLoading />
        ) : (
          <div className="container margin-n-top-60 margin-bottom-30">
            <div className="row">
              <div className="offset-md-1 col-md-10 shadow-sm section-padding-custom wallet-card-info-container">
                <div
                  onClick={() => {
                    router.back();
                  }}
                  className="cursor-pointer d-flex gap-5 align-items-center"
                >
                  <BiArrowBack />
                  <h5 className="font-bold">{t("Back")}</h5>
                </div>
                <p className="mt-2">
                  {t(
                    `If your deposit has not appeared on your balance yet, use the following form to check if the deposit has been received.`
                  )}
                  <br />
                  {t(
                    `So first, select the Network, then select the Coin and then enter the Transaction ID of the deposit that you made. `
                  )}
                  <br />
                  {t(
                    `Then click the Submit button. And then you can check the balance again.`
                  )}
                </p>

                <div className="total-balance mt-4">
                  <h5>{t("Select Network")}</h5>
                  <div className="cp-select-area">
                    <select
                      name="currency"
                      className="form-control coin-list-item  mt-3 h-44"
                      onChange={getCoinLists}
                      value={selectedNetwork}
                    >
                      <option value="">Select Network</option>
                      {networkLists.map((item: any, index: number) => (
                        <option value={item?.id} key={index}>
                          {item?.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="total-balance mt-4">
                  <h5>{t("Select Coin")}</h5>
                  <div className="cp-select-area">
                    <select
                      name="currency"
                      className={`form-control coin-list-item  mt-3 h-44 ${
                        !selectedNetwork && "cursor-not-allowed"
                      } `}
                      disabled={!selectedNetwork}
                      onChange={(e: any) => setSelectedCoin(e.target.value)}
                      value={selectedCoin}
                    >
                      <option value="">Select Coin</option>
                      {coinLists.map((coin: any, index: number) => (
                        <option value={coin?.id} key={index}>
                          {coin?.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="total-balance mt-4">
                  <h5>{t("Transaction ID")}</h5>
                  <div className="input-group input-address-bar mt-3">
                    <input
                      type="text"
                      className="form-control border-0 h-50"
                      id="amountWithdrawal"
                      name="amount"
                      placeholder={t("Enter Transaction ID")}
                      value={transactionId}
                      onChange={(e: any) => setTransactionId(e.target.value)}
                    />
                  </div>
                </div>
                <button
                  className={`h-44 primary-btn-outline bg-primary-color w-100 mt-4 ${
                    isProcessing && "cursor-not-allowed"
                  }`}
                  type="button"
                  onClick={handleCheckDeposit}
                  disabled={isProcessing}
                >
                  {isProcessing ? t("Processing") : t("Submit")}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
      {isModalOpen && (
        <>
          <div className="modal d-block">
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">{t("Deposit Info")}</h5>
                  <button
                    type="button"
                    className="close right-0"
                    onClick={() => setIsModalOpen(false)}
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                {isProcessing ? (
                  <SectionLoading />
                ) : (
                  <>
                    <div className="modal-body p-3">
                      <div>
                        <table className="table">
                          <tbody>
                            <tr>
                              <td className="font-bold">{t("Network")}</td>
                              <td>: {depositInfo?.data?.network}</td>
                            </tr>
                            <tr>
                              <td className="font-bold">{t("Address")}</td>
                              <td className="text-break text-wrap">
                                : {depositInfo?.data?.address}
                              </td>
                            </tr>
                            <tr>
                              <td className="font-bold">{t("From Address")}</td>
                              <td className="text-break text-wrap">
                                : {depositInfo?.data?.from_address}
                              </td>
                            </tr>
                            <tr>
                              <td className="font-bold">
                                {t("Transaction ID")}
                              </td>
                              <td className="text-break text-wrap">
                                : {depositInfo?.data?.txId}
                              </td>
                            </tr>

                            <tr>
                              <td className="font-bold">{t("Amount")}</td>
                              <td>
                                : {depositInfo?.data?.amount}{" "}
                                {depositInfo?.data?.coin_type}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <div className="modal-footer justify-content-center">
                      <h6 className="font-bold">{`**${depositInfo?.message}**`}</h6>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </>
      )}
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx: any) => {
  await SSRAuthCheck(ctx, "/user/check-deposit");

  return {
    props: {},
  };
};
