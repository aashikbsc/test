import Echo from "laravel-echo";
import Pusher from "pusher-js";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
let socketCall = 0;

async function listenMessages(
  setLocalAssetCoinPairs: any,
  setLocalHourlyCoinPairs: any,
  setLocalLatestCoinPairs: any
) {
  //@ts-ignore
  window.Pusher = Pusher;
  //@ts-ignore
  window.Echo = new Echo({
    broadcaster: "pusher",
    key: "test",
    wsHost: process.env.NEXT_PUBLIC_HOST_SOCKET,
    wsPort: process.env.NEXT_PUBLIC_WSS_PORT
      ? process.env.NEXT_PUBLIC_WSS_PORT
      : 6006,
    wssPort: 443,
    forceTLS: false,
    cluster: "mt1",
    disableStats: true,
    enabledTransports: ["ws", "wss"],
  });
  //@ts-ignore
  window.Echo.channel(`market-coin-pair-data`).listen(
    ".market-coin-pairs",
    (e: any) => {
      e.asset_coin_pairs.length && setLocalAssetCoinPairs(e.asset_coin_pairs);
      e.hourly_coin_pairs.length &&
        setLocalHourlyCoinPairs(e.hourly_coin_pairs);
      e.latest_coin_pairs.length &&
        setLocalLatestCoinPairs(e.latest_coin_pairs);
    }
  );
}
const MarketTrends = ({
  landing,
  asset_coin_pairs,
  hourly_coin_pairs,
  latest_coin_pairs,
}: any) => {
  const { t } = useTranslation("common");
  const [localAssetCoinPairs, setLocalAssetCoinPairs] =
    React.useState<any>(asset_coin_pairs);
  const [localHourlyCoinPairs, setLocalHourlyCoinPairs] =
    React.useState<any>(hourly_coin_pairs);
  const [localLatestCoinPairs, setLocalLatestCoinPairs] =
    React.useState<any>(latest_coin_pairs);
  const router = useRouter();
  useEffect(() => {
    if (socketCall === 0) {
      listenMessages(
        setLocalAssetCoinPairs,
        setLocalHourlyCoinPairs,
        setLocalLatestCoinPairs
      );
    }
    socketCall = 1;
  });
  return (
    <div className="">
      <div className="placeTopLeft">
        <img
          src="https://assets-global.website-files.com/60c8db180183804ef2b45120/60cb6b0ac3e71fa837cb2929_hero-glow.svg"
          alt="Hero Banner"
        />
      </div>
      <div className="placeBottomRight">
        <img
          src="https://assets-global.website-files.com/60c8db180183804ef2b45120/60cb6b0ac3e71fa837cb2929_hero-glow.svg"
          alt="Hero Banner"
        />
      </div>

      {parseInt(landing?.landing_third_section_status) === 1 && (
        <section className="market-trend-area">
          <div className="container-4xl market-trend-area-container px-5">
            <div className="section-title">
              <h2 className="title">
                {landing?.market_trend_title || t("Market Trend")}
              </h2>
            </div>
            <div className="exchange-tab-menu">
              <ul className="nav nav-tabs" id="exchangeTab" role="tablist">
                <li className="nav-item" role="presentation">
                  <a
                    className="nav-link active"
                    id="CoreAssets-tab"
                    data-toggle="tab"
                    href="#CoreAssets"
                    role="tab"
                    aria-controls="CoreAssets"
                    aria-selected="true"
                  >
                    {t("Core Assets")}
                  </a>
                </li>
                <li className="nav-item" role="presentation">
                  <a
                    className="nav-link"
                    id="Gainers-tab"
                    data-toggle="tab"
                    href="#Gainers"
                    role="tab"
                    aria-controls="Gainers"
                    aria-selected="false"
                  >
                    {t("24H Gainers")}
                  </a>
                </li>
                <li className="nav-item" role="presentation">
                  <a
                    className="nav-link"
                    id="Listings-tab"
                    data-toggle="tab"
                    href="#Listings"
                    role="tab"
                    aria-controls="Listings"
                    aria-selected="false"
                  >
                    {t("New Listings")}
                  </a>
                </li>
              </ul>
            </div>
            <div className="tab-content" id="exchangeTabContent">
              <div
                className="tab-pane fade show active"
                id="CoreAssets"
                role="tabpanel"
                aria-labelledby="CoreAssets-tab"
              >
                <div className="exchange-volume-table">
                  <div className="table-responsive">
                    <div
                      id="DataTables_Table_0_wrapper"
                      className="dataTables_wrapper no-footer overflow-x-auto"
                    >
                      <table
                        className="table table-borderless dataTable no-footer"
                        id="DataTables_Table_0"
                        role="grid"
                        aria-describedby="DataTables_Table_0_info"
                      >
                        <thead>
                          <tr role="row">
                            <th
                              scope="col"
                              className="sorting_disabled w-137-516"
                              rowSpan={1}
                              colSpan={1}
                            >
                              {t("Market")}
                            </th>
                            <th
                              scope="col"
                              className="sorting_disabled w-81-2812"
                              rowSpan={1}
                              colSpan={1}
                            >
                              {t("Price")}
                            </th>
                            <th
                              scope="col"
                              className="sorting_disabled w-193-797"
                              rowSpan={1}
                              colSpan={1}
                            >
                              {t("Change (24h)")}
                            </th>

                            <th
                              scope="col"
                              className="sorting_disabled w-207-766"
                              rowSpan={1}
                              colSpan={1}
                            >
                              {t("Volume")}
                            </th>
                            <th
                              scope="col"
                              className="sorting_disabled text-right w-127-344"
                              rowSpan={1}
                              colSpan={1}
                            >
                              {t("Actions")}
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {localAssetCoinPairs?.map(
                            (item: any, index: number) => (
                              <tr role="row" className="odd" key={index}>
                                <td className="p-2">
                                  <div className="d-flex flex-wrap">
                                    <img
                                      className="icon mr-3"
                                      src={item?.coin_icon || "/bitcoin.png"}
                                      alt="coin"
                                      width="25px"
                                      height="25px"
                                    />
                                    <a className="cellMarket" href="#">
                                      <div className="marketSymbols">
                                        <span className="quoteSymbol">
                                          {item?.child_coin_name}
                                        </span>
                                        <span className="baseSymbol">
                                          /{item?.parent_coin_name}
                                        </span>
                                      </div>
                                    </a>
                                  </div>
                                </td>
                                <td className="text-black p-2">
                                  {item.last_price}
                                </td>
                                <td className="p-2">
                                  <span
                                    className={`changePos  ${
                                      parseFloat(item.price_change) >= 0
                                        ? "text-success"
                                        : "text-danger"
                                    } `}
                                  >
                                    {item.price_change}%
                                  </span>
                                </td>

                                <td className="text-black p-2">
                                  {item.volume} {item.child_coin_name}
                                </td>
                                <td
                                  className="p-2 text-right"
                                  onClick={async () => {
                                    await localStorage.setItem(
                                      "base_coin_id",
                                      item?.parent_coin_id
                                    );
                                    await localStorage.setItem(
                                      "trade_coin_id",
                                      item?.child_coin_id
                                    );
                                    // await localStorage.setItem(
                                    //   "current_pair",
                                    //   item?.child_coin_name +
                                    //     "_" +
                                    //     item?.parent_coin_name
                                    // );
                                  }}
                                >
                                  <Link
                                    href={
                                      router.locale !== "en"
                                        ? `/${
                                            router.locale
                                          }/exchange/dashboard?coin_pair=${
                                            item?.child_coin_name +
                                            "_" +
                                            item?.parent_coin_name
                                          }`
                                        : `/exchange/dashboard?coin_pair=${
                                            item?.child_coin_name +
                                            "_" +
                                            item?.parent_coin_name
                                          }`
                                    }
                                  >
                                    <a className="btnTrade btn-link">
                                      {t("Trade")}
                                    </a>
                                  </Link>
                                </td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="tab-pane fade"
                id="Gainers"
                role="tabpanel"
                aria-labelledby="Gainers-tab"
              >
                <div className="exchange-volume-table">
                  <div className="table-responsive">
                    <div
                      id="DataTables_Table_1_wrapper"
                      className="dataTables_wrapper no-footer"
                    >
                      <table
                        className="table table-borderless dataTable no-footer"
                        id="DataTables_Table_1"
                        role="grid"
                        aria-describedby="DataTables_Table_1_info"
                      >
                        <thead>
                          <tr role="row">
                            <th
                              scope="col"
                              className="sorting_disabled w-0"
                              rowSpan={1}
                              colSpan={1}
                            >
                              {t("Market")}
                            </th>
                            <th
                              scope="col"
                              className="sorting_disabled w-0"
                              rowSpan={1}
                              colSpan={1}
                            >
                              {t("Price")}
                            </th>
                            <th
                              scope="col"
                              className="sorting_disabled w-0"
                              rowSpan={1}
                              colSpan={1}
                            >
                              {t("Change (24h)")}
                            </th>

                            <th
                              scope="col"
                              className="sorting_disabled w-0"
                              rowSpan={1}
                              colSpan={1}
                            >
                              {t("Volume")}
                            </th>
                            <th
                              scope="col"
                              className="sorting_disabled w-0"
                              rowSpan={1}
                              colSpan={1}
                            >
                              {t("Actions")}
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {localHourlyCoinPairs?.map(
                            (item: any, index: number) => (
                              <tr role="row" className="odd" key={index}>
                                <td className="p-2">
                                  <div className="d-flex flex-wrap">
                                    <img
                                      className="icon mr-3"
                                      src={item?.coin_icon || "/bitcoin.png"}
                                      alt="coin"
                                      width="25px"
                                      height="25px"
                                    />
                                    <a className="cellMarket" href="#">
                                      <div className="marketSymbols">
                                        <span className="quoteSymbol">
                                          {item?.child_coin_name}
                                        </span>
                                        <span className="baseSymbol">
                                          /{item?.parent_coin_name}
                                        </span>
                                      </div>
                                    </a>
                                  </div>
                                </td>
                                <td className="text-black p-2">
                                  {item.last_price}
                                </td>
                                <td className="p-2">
                                  <span
                                    className={`changePos  ${
                                      parseFloat(item.price_change) >= 0
                                        ? "text-success"
                                        : "text-danger"
                                    } `}
                                  >
                                    {item.price_change}%
                                  </span>
                                </td>

                                <td className="text-black p-2">
                                  {item.volume} {item.child_coin_name}
                                </td>
                                <td
                                  onClick={async () => {
                                    await localStorage.setItem(
                                      "base_coin_id",
                                      item?.parent_coin_id
                                    );
                                    await localStorage.setItem(
                                      "trade_coin_id",
                                      item?.child_coin_id
                                    );
                                    await localStorage.setItem(
                                      "current_pair",
                                      item?.child_coin_name +
                                        "_" +
                                        item?.parent_coin_name
                                    );
                                  }}
                                  className="p-2"
                                >
                                  <a
                                    href="/exchange/dashboard"
                                    className="btnTrade btn-link"
                                  >
                                    {t("Trade")}
                                  </a>
                                </td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="tab-pane fade"
                id="Listings"
                role="tabpanel"
                aria-labelledby="Listings-tab"
              >
                <div className="exchange-volume-table">
                  <div className="table-responsive">
                    <div
                      id="DataTables_Table_2_wrapper"
                      className="dataTables_wrapper no-footer"
                    >
                      <table
                        className="table table-borderless dataTable no-footer"
                        id="DataTables_Table_2"
                        role="grid"
                        aria-describedby="DataTables_Table_2_info"
                      >
                        <thead>
                          <tr role="row">
                            <th
                              scope="col"
                              className="sorting_disabled w-0"
                              rowSpan={1}
                              colSpan={1}
                            >
                              {t("Market")}
                            </th>
                            <th
                              scope="col"
                              className="sorting_disabled w-0"
                              rowSpan={1}
                              colSpan={1}
                            >
                              {t("Price")}
                            </th>
                            <th
                              scope="col"
                              className="sorting_disabled w-0"
                              rowSpan={1}
                              colSpan={1}
                            >
                              {t("Change (24h)")}
                            </th>

                            <th
                              scope="col"
                              className="sorting_disabled w-0"
                              rowSpan={1}
                              colSpan={1}
                            >
                              {t("Volume")}
                            </th>
                            <th
                              scope="col"
                              className="sorting_disabled w-0"
                              rowSpan={1}
                              colSpan={1}
                            >
                              {t("Actions")}
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {localLatestCoinPairs?.map(
                            (item: any, index: number) => (
                              <tr role="row" className="odd" key={index}>
                                <td className="p-2">
                                  <div className="d-flex flex-wrap">
                                    <img
                                      className="icon mr-3"
                                      src={item?.coin_icon || "/bitcoin.png"}
                                      alt="coin"
                                      width="25px"
                                      height="25px"
                                    />
                                    <a className="cellMarket" href="#">
                                      <div className="marketSymbols">
                                        <span className="quoteSymbol">
                                          {item?.child_coin_name}
                                        </span>
                                        <span className="baseSymbol">
                                          /{item?.parent_coin_name}
                                        </span>
                                      </div>
                                    </a>
                                  </div>
                                </td>
                                <td className="text-black p-2">
                                  {item.last_price}
                                </td>
                                <td className="p-2">
                                  <span
                                    className={`changePos  ${
                                      parseFloat(item.price_change) >= 0
                                        ? "text-success"
                                        : "text-danger"
                                    } `}
                                  >
                                    {item.price_change}%
                                  </span>
                                </td>

                                <td className="text-black p-2">
                                  {item.volume} {item.child_coin_name}
                                </td>
                                <td
                                  onClick={async () => {
                                    await localStorage.setItem(
                                      "base_coin_id",
                                      item?.parent_coin_id
                                    );
                                    await localStorage.setItem(
                                      "trade_coin_id",
                                      item?.child_coin_id
                                    );
                                    await localStorage.setItem(
                                      "current_pair",
                                      item?.child_coin_name +
                                        "_" +
                                        item?.parent_coin_name
                                    );
                                  }}
                                  className="p-2"
                                >
                                  <a
                                    href="/exchange/dashboard"
                                    className="btnTrade btn-link"
                                  >
                                    {t("Trade")}
                                  </a>
                                </td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
      <div className="container-4xl ">
        {Number(landing?.landing_advertisement_section_status) === 1 && (
          <Link href={`${landing?.landing_advertisement_url ?? "#"}`}>
            <img
              src={
                landing?.landing_advertisement_image
                  ? landing?.landing_advertisement_image
                  : "/tradex-cover.png"
              }
              className="cover-img cursor-pointer mt-0"
            />
          </Link>
        )}
      </div>
    </div>
  );
};

export default MarketTrends;
