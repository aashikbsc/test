import React from "react";
import FiatMenuNav from "./FiatMenuNav";

export default function FiatHeader({ title, imageUrl }: any) {
  return (
    <div>
      <div className="my-0 wallet-overview-header-main bg_cover_dashboard">
        <div className="profle-are-top container-4xl">
          <h2 className="wallet-overview-header-title">{title}</h2>
        </div>
        <FiatMenuNav />
      </div>
    </div>
  );
}
