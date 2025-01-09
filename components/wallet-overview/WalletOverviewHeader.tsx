import WalletOverViewMenuTab from "layout/WalletOverViewMenuTab";
import Link from "next/link";
import React from "react";

export default function WalletOverviewHeader({ title, imageUrl }: any) {
  return (
    <div>
      <div className="my-0 wallet-overview-header-main bg_cover_dashboard">
        <div className="profle-are-top container-4xl">
          <h2 className="wallet-overview-header-title">{title}</h2>
        </div>
        <WalletOverViewMenuTab />
      </div>
    </div>
  );
}
