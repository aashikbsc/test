import { formatCurrency } from "common";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "state/store";

export default function MarketsCardItem({ item }: any) {
  const { dashboard } = useSelector((state: RootState) => state.exchange);

  return (
    <div className="card-for-markets-item">
      <div className="row">
        <div className="col-4 d-flex  align-items-center">
          <img
            className="icon mr-2"
            src={item?.coin_icon || "/bitcoin.png"}
            alt="coin"
            width="25px"
            height="25px"
          />
          <p className="text-primary">{item?.coin_type}</p>
        </div>

        <div className="col-4">
          <p className="text-primary">
            {item?.currency_symbol}

            {formatCurrency(
              item.usdt_price,
              dashboard?.order_data?.total?.trade_wallet?.pair_decimal
            )}
          </p>
        </div>
        <div className="col-4">
          <p
            className={`${
              parseFloat(item?.change) >= 0 ? "text-success" : "text-danger"
            } `}
          >
            {item?.change >= 0
              ? "+" +
                formatCurrency(
                  item.change,
                  dashboard?.order_data?.total?.trade_wallet?.pair_decimal
                )
              : formatCurrency(
                  item.change,
                  dashboard?.order_data?.total?.trade_wallet?.pair_decimal
                )}
          </p>
        </div>
      </div>
    </div>
  );
}
