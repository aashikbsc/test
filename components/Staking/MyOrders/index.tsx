import { NoItemFound } from "components/NoItemFound/NoItemFound";
import SectionLoading from "components/common/SectionLoading";
import {
  STAKING_INVESTMENT_STATUS_CANCELED,
  STAKING_INVESTMENT_STATUS_PAID,
  STAKING_INVESTMENT_STATUS_RUNNING,
  STAKING_INVESTMENT_STATUS_SUCCESS,
  STAKING_INVESTMENT_STATUS_UNPAID,
} from "helpers/core-constants";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { investmentCanceled } from "service/staking";
import MyModalsPayment from "./modal";
import useTranslation from "next-translate/useTranslation";

export const InvesmentOrderTable = ({
  actionFunction,
  filter = false,
}: any) => {
  const { t } = useTranslation("common");

  const [selectedStatus, setSelectedStatus] = useState("all");
  const [modalData, setModalData] = useState({});
  const [selectedCoin, setSelectedCoins] = useState("all");
  const [processing, setProcessing] = useState<boolean>(false);
  const [history, setHistory] = useState<any>([]);
  const [stillHistory, setStillHistory] = useState<any>([]);
  const LinkTopaginationString = (page: any) => {
    const url = page.url.split("?")[1];
    const number = url.split("=")[1];
    actionFunction(
      5,
      parseInt(number),
      setHistory,
      setProcessing,
      setStillHistory,
      selectedStatus,
      selectedCoin
    );
  };

  useEffect(() => {
    actionFunction(
      5,
      1,
      setHistory,
      setProcessing,
      setStillHistory,
      selectedStatus,
      selectedCoin
    );
  }, [selectedStatus, selectedCoin]);
  const investmentCanceledAction = async (uid: string) => {
    const response = await investmentCanceled(uid);
    if (response.success) {
      actionFunction(
        5,
        1,
        setHistory,
        setProcessing,
        setStillHistory,
        selectedStatus,
        selectedCoin
      );
      toast.success(response.message);
    } else {
      toast.error(response.message);
    }
  };

  return (
    <div className="container-4xl margin-n-top-60 margin-bottom-30">
      {processing ? (
        <SectionLoading />
      ) : (
        <div className="row ">
          <div className="col-12">
            <div className="table-responsive shadow-sm section-padding-custom wallet-card-info-container ">
              <table className="table mt-4">
                <thead>
                  <tr>
                    <th scope="col">{t(`Coin Type`)}</th>
                    <th scope="col">{t(`Daily Earning`)}</th>
                    <th scope="col">{t(`Investment Amount`)}</th>
                    <th scope="col">{t(`Auto Renew`)}</th>
                    <th scope="col">{t(`Status`)}</th>
                    <th scope="col">{t(`Estimated Interest`)}</th>
                    <th scope="col">{t(`Time Period`)}</th>
                    <th scope="col"></th>
                  </tr>
                </thead>
                <tbody>
                  {history.length > 0 &&
                    history?.map((item: any, index: any) => (
                      <tr className="tableRow" key={index}>
                        <td>
                          <div className="tableImg d-flex align-items-center">
                            <h6 className="">{item?.coin_type}</h6>
                          </div>
                        </td>
                        <td>
                          <h6 className="mx-2">
                            {parseFloat(item.earn_daily_bonus)}{" "}
                            {item?.coin_type}
                          </h6>
                        </td>
                        <td>{parseFloat(item.investment_amount)}</td>
                        <td>
                          {parseInt(item.auto_renew_status) === 1
                            ? "Disabled"
                            : parseInt(item.auto_renew_status) === 2
                            ? "Enabled"
                            : ""}
                        </td>
                        <td>
                          {parseInt(item?.status) ===
                          STAKING_INVESTMENT_STATUS_SUCCESS
                            ? "Success"
                            : parseInt(item?.status) ===
                              STAKING_INVESTMENT_STATUS_PAID
                            ? "Paid"
                            : parseInt(item?.status) ===
                              STAKING_INVESTMENT_STATUS_UNPAID
                            ? "Un Paid"
                            : parseInt(item?.status) ===
                              STAKING_INVESTMENT_STATUS_CANCELED
                            ? "Canceled"
                            : parseInt(item?.status) ===
                              STAKING_INVESTMENT_STATUS_RUNNING
                            ? "Running"
                            : ""}
                        </td>

                        <td>
                          {item.total_bonus} {item?.coin_type}
                        </td>
                        <td>
                          {item.period} {t(`Days`)}
                        </td>
                        {parseInt(item?.status) ===
                        STAKING_INVESTMENT_STATUS_RUNNING ? (
                          <td
                            onClick={() => {
                              investmentCanceledAction(item?.uid);
                            }}
                            className="primary-text"
                          >
                            {t(`Cancel`)}
                          </td>
                        ) : parseInt(item?.status) ===
                          STAKING_INVESTMENT_STATUS_CANCELED ? (
                          <td className="text-danger">{t(`Cancelled`)}</td>
                        ) : parseInt(item?.status) ===
                          STAKING_INVESTMENT_STATUS_PAID ? (
                          <td className="text-success">{t(`Paid`)}</td>
                        ) : (
                          ""
                        )}
                        <td
                          data-target="#exampleModal"
                          data-toggle="modal"
                          onClick={() => {
                            setModalData(item);
                          }}
                        >
                          {t(`Details`)}
                        </td>
                      </tr>
                    ))}
                </tbody>
                <MyModalsPayment modalData={modalData} />
              </table>
              {history?.length == 0 && <NoItemFound />}
              {history?.length > 0 && (
                <div className="pagination-wrapper" id="assetBalances_paginate">
                  <span>
                    {stillHistory?.links?.map((link: any, index: number) =>
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
  );
};
