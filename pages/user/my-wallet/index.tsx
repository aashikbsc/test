import { SSRAuthCheck } from "middlewares/ssr-authentication-check";
import type { GetServerSideProps, NextPage } from "next";
import { toast } from "react-toastify";
import React, { useEffect, useState } from "react";
import { IoWalletOutline } from "react-icons/io5";
import { TiArrowRepeat } from "react-icons/ti";
import ReactPaginate from "react-paginate";

import {
  HiOutlineBanknotes,
  HiOutlinePresentationChartLine,
} from "react-icons/hi2";

import {
  SearchObjectArrayFuesJS,
  WalletListApiAction,
} from "state/actions/wallet";
import Loading from "components/common/SectionLoading";
import Link from "next/link";
import useTranslation from "next-translate/useTranslation";
import { useSelector } from "react-redux";
import { RootState } from "state/store";
import { TradeList } from "components/TradeList";
import { appDashboardDataWithoutPair } from "service/exchange";
import Footer from "components/common/footer";
import CustomDataTable from "components/Datatable";
import WalletOverviewSidebar from "layout/WalletOverviewSidebar";
import WalletOverviewHeader from "components/wallet-overview/WalletOverviewHeader";
import { useRouter } from "next/router";
import PlaceBottomRight from "components/gradient/placeBottomRight";
import PlaceTopLeft from "components/gradient/placeTopLeft";
import { getTotalWalletBalanceApi } from "service/wallet";
import SectionLoading from "components/common/SectionLoading";
const MyWallet: NextPage = () => {
  const { t } = useTranslation("common");
  const router = useRouter();
  const { settings } = useSelector((state: RootState) => state.common);
  const [search, setSearch] = useState<any>("");
  const [walletList, setWalletList] = useState<any>([]);
  const [selectedPerPage, setSelectedPerPage] = useState("15");
  const [Changeable, setChangeable] = useState<any[]>([]);
  const [processing, setProcessing] = useState<boolean>(false);
  const [allData, setAllData] = useState<any>();
  const [tradeList, setTradeList]: any = useState();
  const [coinList, setCoinList]: any = useState([]);
  const [totalBalance, setTotalBalance] = useState<any>(0);
  const [selectedLimit, setSelectedLimit] = useState<any>("10");
  const [loadingForTotalBalance, setLoadingForTotalBalance] = useState(false);

  useEffect(() => {
    if (router.query.errorMessage) {
      toast.error(router.query.errorMessage);
      const { pathname, query } = router;
      delete query.errorMessage;
      router.replace(
        {
          pathname,
          query,
        },
        undefined,
        { shallow: true }
      );
    }
  }, [router.query.errorMessage]);
  const columns = [
    {
      Header: t("Asset"),

      Cell: ({ row }: any) => (
        <div className="asset d-flex align-items-center gap-10">
          <div className="overflow-hidden w-35 h-35 rounded-50p">
            <img
              className="asset-icon"
              src={row.original.coin_icon || "/bitcoin.png"}
              alt=""
              width={35}
              height={35}
            />
          </div>
          <div>
            <p className="asset-name">{row.original?.coin_type}</p>
            <p className="asset-name">{row.original?.name}</p>
          </div>
        </div>
      ),
    },

    {
      Header: t("On Order"),
      Cell: ({ row }: any) => (
        <div className="blance-text">
          <span className="blance market incree border-0 p-0 text-10c75c">
            {row?.original?.on_order}
          </span>
          <span className="usd">
            ({settings?.currency_symbol}
            {parseFloat(row?.original?.on_order_usd).toFixed(8)})
          </span>
        </div>
      ),
    },
    {
      Header: t("Available Balance"),
      Cell: ({ row }: any) => (
        <div className="blance-text">
          <span className="blance">
            {parseFloat(row?.original?.balance).toFixed(8)}
          </span>
          <span className="usd">
            ({settings?.currency_symbol}
            {parseFloat(row?.original?.available_balance_usd).toFixed(8)})
          </span>
        </div>
      ),
    },
    {
      Header: t("Total Balance"),
      Cell: ({ row }: any) => (
        <div className="blance-text">
          <span className="blance">
            {/* @ts-ignore */}
            {parseFloat(
              // @ts-ignore
              Number(row?.original?.balance) + Number(row?.original?.on_order)
            ).toFixed(8)}
          </span>
          <span className="usd">
            ({settings?.currency_symbol}
            {parseFloat(row?.original?.total_balance_usd).toFixed(8)})
          </span>
        </div>
      ),
    },
    {
      Header: t("Action"),
      Cell: ({ row }: any) => (
        <div className="active-link">
          <ul>
            {row?.original.is_deposit === 1 && (
              <Link href={setDepositCryptoOrFiatUrl(row?.original)}>
                <li className="toolTip relative cursor-pointer" title="Deposit">
                  <HiOutlineBanknotes size={25} />
                </li>
              </Link>
            )}
            {row?.original.is_withdrawal === 1 && (
              <Link href={setWithdrawCryptoOrFiatUrl(row?.original)}>
                <li
                  className="toolTip relative cursor-pointer"
                  title="Withdraw"
                >
                  <IoWalletOutline size={25} />
                </li>
              </Link>
            )}

            <li
              className="toolTip trade-li cursor-pointer"
              title="Trade"
              onClick={() =>
                handleActive(tradeList ? null : row?.original?.id + 1)
              }
            >
              <HiOutlinePresentationChartLine size={25} />
              {tradeList === row?.original?.id + 1 && (
                <div className="trade-select">
                  <TradeList coinList={coinList.pairs} />
                </div>
              )}
            </li>
            {/* {parseInt(settings?.swap_status) === 1 &&
              (Changeable.length >= 2 ? (
                <Link href={`/user/swap-coin?coin_id=${row?.original.id}`}>
                  <li className="toolTip relative cursor-pointer" title="swap">
                    <TiArrowRepeat size={25} />
                  </li>
                </Link>
              ) : (
                <li
                  className="toolTip relative cursor-pointer"
                  title="swap"
                  onClick={() => {
                    toast.error("Two coins are required to swap");
                  }}
                >
                  <TiArrowRepeat size={25} />
                </li>
              ))} */}
            {parseInt(settings?.swap_status) === 1 && (
              <Link href={`/user/swap-coin?coin_id=${row?.original.id}`}>
                <li className="toolTip relative cursor-pointer" title="swap">
                  <TiArrowRepeat size={25} />
                </li>
              </Link>
            )}
          </ul>
        </div>
      ),
    },
  ];

  const handleActive = (index: any) => {
    if (index === tradeList) {
      setTradeList(index);
    } else {
      setTradeList(index);
    }
  };

  const handlePageClick = (event: any) => {
    getWalletLists(
      `/wallet-list?page=${
        event.selected + 1
      }&per_page=${selectedLimit}&search=${search}`
    );
  };

  const getWalletLists = async (url: string) => {
    const response: any = await WalletListApiAction(url, setProcessing);
    console.log("response", response);
    setWalletList(response?.wallets);
    setChangeable(response?.wallets?.data);
    // setAllData(response);
  };

  const getWalletTotalBalance = async () => {
    setLoadingForTotalBalance(true);
    const response: any = await getTotalWalletBalanceApi();
    if (!response?.success) {
      setLoadingForTotalBalance(false);
      return;
    }
    setTotalBalance(response?.data?.total || 0);
    setLoadingForTotalBalance(false);
  };

  // const LinkTopaginationString = async (link: any) => {
  //   if (link.url === null) return;
  //   if (link.label === walletList.current_page.toString()) return;
  //   const splitLink = link.url.split("api");
  //   const response: any = await WalletListApiAction(
  //     splitLink[1] + "&per_page=" + selectedLimit + "&search=" + search,
  //     setProcessing
  //   );
  //   setWalletList(response?.wallets);
  //   setChangeable(response?.wallets?.data);
  // };

  console.log("Changeable", Changeable);
  const coinListApi = async () => {
    const coinList = await appDashboardDataWithoutPair();
    setCoinList(coinList);
  };

  useEffect(() => {
    getWalletTotalBalance();
  }, []);

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      coinListApi();
      getWalletLists(
        `/wallet-list?page=1&per_page=${selectedLimit}&search=${search}`
      );
    }, 500); // Adjust the delay as needed

    return () => {
      clearTimeout(debounceTimeout);
      setWalletList(null);
    };
  }, [search, selectedLimit]);

  const setDepositCryptoOrFiatUrl = (item: any) => {
    if (item.currency_type == 1) {
      return `/user/my-wallet/deposit?type=deposit&coin_id=${item.id}`;
    }
    return `/user/fiat/deposit?type=deposit&coin_id=${item.id}&currency=${item.coin_type}`;
  };
  const setWithdrawCryptoOrFiatUrl = (item: any) => {
    if (item.currency_type == 1) {
      return `/user/my-wallet/withdraw?type=withdraw&coin_id=${item.id}`;
    }
    return `/user/fiat/withdraw?type=withdraw&coin_id=${item.id}&currency=${item.coin_type}`;
  };
  return (
    <>
      <div className="page-wrap">
        {/* <WalletOverviewSidebar /> */}
        <div className="page-main-content pt-0">
          <div className="">
            <WalletOverviewHeader title={`Spot Wallet`} />
            <PlaceBottomRight />

            <div className="row  container-4xl">
              <PlaceTopLeft />
              <div className="col-md-12 px-0 margin-n-top-60 margin-bottom-30">
                <div className="shadow-sm section-padding-custom wallet-card-info-container">
                  {loadingForTotalBalance ? (
                    <SectionLoading />
                  ) : (
                    <div className="py-5 border-b-1 border-border-color">
                      <div>
                        <h6>{t("Total Balance")}</h6>
                        <div className="pt-3">
                          <div>
                            <h3 className="mobile-font-size-for-total-wallet">
                              {totalBalance}
                              {""} {settings?.currency}
                            </h3>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="asset-balances-area cstm-loader-area">
                    <div className="asset-balances-left">
                      <div className="section-wrapper px-0">
                        <div className="tableScroll pr-0">
                          <div className=" table-responsive">
                            <CustomDataTable
                              columns={columns}
                              data={Changeable}
                              selectedLimit={selectedLimit}
                              setSelectedLimit={setSelectedLimit}
                              search={search}
                              setSearch={setSearch}
                              processing={processing}
                              verticalAlignData={`middle`}
                              isOverflow={true}
                            />

                            <div className="row justify-content-center mt-5">
                              <ReactPaginate
                                nextLabel=">"
                                onPageChange={handlePageClick}
                                pageRangeDisplayed={5}
                                pageCount={Math.ceil(
                                  walletList?.total / selectedLimit
                                )}
                                previousLabel="<"
                                renderOnZeroPageCount={null}
                                className={`d-flex align-items-center justify-content-center`}
                                pageLinkClassName={`paginate-number`}
                                activeLinkClassName={`active-paginate-cls`}
                                previousLinkClassName={`text-primary-color text-25 mr-2`}
                                nextLinkClassName={`text-primary-color text-25 ml-2`}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
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
  await SSRAuthCheck(ctx, "/user/my-wallet");
  return {
    props: {},
  };
};

export default MyWallet;
