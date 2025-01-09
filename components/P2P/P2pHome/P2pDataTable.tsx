import { BuyFrom } from "./BuyFrom";
import { useState } from "react";
import Link from "next/link";
import { NoItemFound } from "components/NoItemFound/NoItemFound";
import { BUY } from "helpers/core-constants";
import { RootState } from "state/store";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import useTranslation from "next-translate/useTranslation";
import { handleP2PDeleteApi, handleP2PStatusChangeApi } from "service/p2p";
import { toast } from "react-toastify";

export const P2pDataTable = ({
  history,
  filters,
  isLoggedIn,
  statusChange = false,
  deleteBtn = false,
  action = true,
  payment = true,
  edit = false,
  adsType,
}: any) => {
  const { t } = useTranslation("common");

  const router = useRouter();

  const [historyData, setHistoryData] = useState(history || []);

  const handleStatusChange = async (item: any) => {
    if (!statusChange) return;
    const response = await handleP2PStatusChangeApi({
      type: adsType,
      id: item.uid,
    });
    if (!response.success) {
      toast.error(response.message);
      return;
    }
    let newData = historyData.map((item: any) => {
      if (item.uid == response.data.id) {
        return {
          ...item,
          status: response.data.status ? 1 : 0,
        };
      }
      return item;
    });

    setHistoryData(newData);
    toast.success(response.message);
  };

  const handleAdsDelete = async (ads_id: any) => {
    if (!deleteBtn) return;
    const confirm = window.confirm("Are you sure you want to proceed?");
    if (!confirm) return;
    const response = await handleP2PDeleteApi({
      ads_type: adsType,
      uid: ads_id,
    });
    if (!response.success) {
      toast.error(response.message);
      return;
    }
    let newData = historyData.filter((item: any) => item.uid != ads_id);

    setHistoryData(newData);
    toast.success(response.message);
  };
  return (
    <div className="glass-color-bg-custom pt-5 backdrop-filter-none">
      <div className="container-4xl">
        <div className="row mx-0">
          <div className="table-responsive overflow-x-auto">
            {historyData?.length <= 0 || !historyData ? (
              <NoItemFound />
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col" className="p-l-10 p-r-10">
                      {t(`Advertisers`)}
                    </th>
                    <th scope="col" className="p-l-10 p-r-10">
                      {t(`Price`)}
                    </th>
                    <th scope="col" className="p-l-10 p-r-10">
                      {t(`Limit/Available`)}
                    </th>
                    {statusChange && (
                      <th scope="col" className="text-center p-l-10 p-r-10">
                        {t(`Status`)}
                      </th>
                    )}

                    {payment === true && (
                      <th scope="col" className="p-l-10 p-r-10">
                        {t(`Payment`)}
                      </th>
                    )}
                    {action === true && (
                      <th scope="col" className="p-l-10 p-r-10">
                        {t(`Trade`)}
                      </th>
                    )}
                    {edit === true && (
                      <th scope="col" className="p-l-10 p-r-10">
                        {t(`Action`)}
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {historyData?.map((item: any, index: any) => (
                    <tr className="tableRow" key={index}>
                      <td className="text-nowrap">
                        <Link href={"/p2p/profile/" + item?.user_id}>
                          <div className="tableImg d-flex align-items-center min-w-max-content">
                            <img src={item?.user?.photo} alt="" />
                            <h5>{item?.user?.nickname}</h5>
                          </div>
                        </Link>
                      </td>
                      <td className="d-flex">
                        <h5 className="mr-1">
                          {parseFloat(item?.price).toFixed(2)}
                        </h5>{" "}
                        {item?.currency}
                      </td>
                      <td className="text-nowrap">
                        <div className="d-flex align-items-center">
                          <small className="mr-2">{t(`Available`)}</small>
                          <h6 className="limitBalance">
                            {parseFloat(item?.available).toFixed(8)}{" "}
                            {item?.coin_type}
                          </h6>
                        </div>
                        <div className="d-flex align-items-center">
                          <small className="mr-2">{t(`Limit`)}</small>
                          <h6 className="limitBalance">
                            {item?.minimum_trade_size} {item?.currency}-
                            {item?.maximum_trade_size} {item?.currency}
                          </h6>
                        </div>
                      </td>
                      {statusChange && (
                        <td className="text-center text-nowrap align-middle">
                          <label className="gift-card-buy-switch mb-0">
                            <input
                              type="checkbox"
                              checked={item?.status == 1 ? true : false}
                              onChange={(e) => handleStatusChange(item)}
                            />
                            <span className="gift-card-buy-slider gift-card-buy"></span>
                          </label>
                        </td>
                      )}

                      {payment && (
                        <td className="text-nowrap">
                          {item?.payment_method_list?.map(
                            (payment: any, index: any) => (
                              <span
                                className="badge badge-light mr-2"
                                key={index}
                              >
                                {payment?.admin_pamynt_method?.name}
                              </span>
                            )
                          )}
                        </td>
                      )}

                      {action === true && (
                        <td className="text-nowrap">
                          {isLoggedIn === true && (
                            <Link
                              href={`/p2p/details/${item.uid}?adtype=${filters.type}`}
                            >
                              <button className="tableButton">
                                {filters.type === BUY ? "Buy" : "Sell"}{" "}
                                {item.coin_type}
                              </button>
                            </Link>
                          )}
                        </td>
                      )}
                      {(edit === true || deleteBtn === true) && (
                        <td className="text-nowrap">
                          {isLoggedIn === true && (
                            // <Link
                            //   href={`/p2p/add-post?uid=${item.uid}&&ads_type=${filters.type}`}
                            // >
                            <>
                              {edit && (
                                <button
                                  onClick={async () => {
                                    await router.push(
                                      `/p2p/add-post?uid=${item.uid}&&ads_type=${filters.type}`
                                    );
                                    await router.reload();
                                  }}
                                  className="tableButton"
                                >
                                  {t(`Edit`)}
                                </button>
                              )}

                              {deleteBtn && (
                                <button
                                  onClick={() => handleAdsDelete(item.uid)}
                                  className="tableButton bg-secondary ml-2"
                                >
                                  {t(`Delete`)}
                                </button>
                              )}
                            </>
                            // </Link>
                          )}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
