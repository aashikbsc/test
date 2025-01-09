import { CUstomSelect } from "components/common/CUstomSelect";
import MarketsCards from "components/markets/MarketsCards";
import TradesTable from "components/markets/TradesTable";
import Echo from "laravel-echo";
import Pusher from "pusher-js";
import useTranslation from "next-translate/useTranslation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getCurrenyApi, getMarketCardDatasApi } from "service/markets";
import Footer from "components/common/footer";
import MarketOverviewHeader from "components/markets/MarketOverviewHeader";
import PlaceBottomRight from "components/gradient/placeBottomRight";
import PlaceTopLeft from "components/gradient/placeTopLeft";

async function listenMessages(setMarketsCardData: any) {
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
  window.Echo.channel(`market-overview-coin-statistic-list-data`).listen(
    ".market-overview-coin-statistic-list",
    (e: any) => {
      setMarketsCardData(e);
    }
  );
}

export default function Index() {
  const { t } = useTranslation();
  const [marketsCardData, setMarketsCardData] = useState<any>();
  const [allCurrency, setAllCurrency] = useState([
    {
      label: "USD",
      value: "USD",
    },
  ]);

  const [selectedCurrency, setSelectedCurrency] = useState({
    label: "USD",
    value: "USD",
  });

  useEffect(() => {
    getCurreny();
  }, []);

  useEffect(() => {
    getMarketCardDatas(selectedCurrency.value);
  }, [selectedCurrency]);

  useEffect(() => {
    listenMessages(setMarketsCardData);
  }, []);

  const getCurreny = async () => {
    const data = await getCurrenyApi();
    if (!data.success) {
      toast.error(data.message);
    }
    setAllCurrency(data.data);
  };
  const getMarketCardDatas = async (currency_type: any) => {
    const data = await getMarketCardDatasApi(currency_type);
    if (!data.success) {
      toast.error(data.message);
      return;
    }
    setMarketsCardData(data.data);
  };

  const handleCoinType = (data: any) => {
    setSelectedCurrency(data);
  };

  return (
    <section>
      <MarketOverviewHeader title={t("Markets Overview")} />
      <PlaceBottomRight />
      <PlaceTopLeft />
      <div className="container-4xl">
        <div className="row margin-n-top-60 margin-bottom-30 row-gap-20">
          {marketsCardData?.highlight_coin.length > 0 && (
            <div className="col-md-6 col-lg-3">
              <div className="shadow-sm p-3 bg-card-glass-clr">
                <MarketsCards
                  title={`Highlight Coin`}
                  cardItems={marketsCardData?.highlight_coin}
                />
              </div>
            </div>
          )}
          {marketsCardData?.new_listing.length > 0 && (
            <div className="col-md-6 col-lg-3">
              <div className="shadow-sm p-3 bg-card-glass-clr">
                <MarketsCards
                  title={`New Listing`}
                  cardItems={marketsCardData?.new_listing}
                />
              </div>
            </div>
          )}
          {marketsCardData?.top_gainer_coin.length > 0 && (
            <div className="col-md-6 col-lg-3">
              <div className="shadow-sm p-3 bg-card-glass-clr">
                <MarketsCards
                  title={`Top Gainer Coin`}
                  cardItems={marketsCardData?.top_gainer_coin}
                />
              </div>
            </div>
          )}
          {marketsCardData?.top_volume_coin.length > 0 && (
            <div className="col-md-6 col-lg-3">
              <div className="shadow-sm p-3 bg-card-glass-clr">
                <MarketsCards
                  title={`Top Volume Coin`}
                  cardItems={marketsCardData?.top_volume_coin}
                />
              </div>
            </div>
          )}
        </div>
      </div>
      <div>
        {/* trade section start*/}
        <TradesTable selectedCurrency={selectedCurrency} />
        {/* trade section end */}
      </div>
      <Footer />
    </section>
  );
}
