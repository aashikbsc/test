import React, { useState } from "react";
import OrderBook from "../OrderBook";
import ExchangeBox from "../ExchangeBox";
import dynamic from "next/dynamic";
import { useSelector } from "react-redux";
import { RootState } from "state/store";
import MyOrderHistory from "../MyOrderHistory";
import TradesHistory from "components/exchange/TradesHistory";
const TradingChart = dynamic(
  () =>
    import("components/exchange/TradingChart").then(
      (mod: any) => mod.TVChartContainer
    ),
  { ssr: false }
);
const TradeBox = ({ ThemeColor }: any) => {
  const { marketTrades, currentPair } = useSelector(
    (state: RootState) => state.futureExchange
  );
  const [disableCross, setdisableCross] = useState(false);
  const [disableIsolated, setdisableIsolated] = useState(false);
  const { theme } = useSelector((state: RootState) => state.common);
  return (
    <div className="row trade-dashboard-side-margin">
      <div className="col-xl-9">
        <div className="row">
          <div className="col-xl-8 px-0 exchange-area">
            {currentPair && (
              <TradingChart
                //@ts-ignore
                currentPair={currentPair}
                theme={theme}
                ThemeColor={ThemeColor}
              />
            )}
          </div>
          <div className="col-xl-4 px-0 exchange-area">
            <ExchangeBox
              disableCross={disableCross}
              disableIsolated={disableIsolated}
            />
          </div>
          <div className="col-xl-8 px-1 py-1">
            Bitter Futures charting solution is provided by TradingView, a
            charting platform for the global community. In addition to charts
            such as BTCUSD, advanced analysis tools such as&nbsp;
            <a
              href="https://kr.tradingview.com/economic-calendar/"
              target="_new"
            >
              economic calendars
            </a>{" "}
            or&nbsp;
            <a href="https://kr.tradingview.com/screener/" target="_new">
              stock screeners
            </a>{" "}
            allow you to trade based on comprehensive market analysis.
          </div>
          <div className="col-xl-12 px-0">
            <MyOrderHistory
              setdisableCross={setdisableCross}
              setdisableIsolated={setdisableIsolated}
            />
            {/* <TradesHistory marketTrades={marketTrades} /> */}
          </div>
        </div>
      </div>
      <div className="col-xl-3  px-0">
        <div className="">
          <OrderBook />
        </div>
        <TradesHistory marketTrades={marketTrades} />
      </div>
    </div>
  );
};

export default TradeBox;
