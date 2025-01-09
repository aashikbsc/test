import React from "react";
import StakingHeaderMenuTab from "./StakingHeaderMenuTab";
import { useSelector } from "react-redux";
import { RootState } from "state/store";

export default function StakingHeader({ title, imageUrl, description }: any) {
  const { isLoggedIn } = useSelector((state: RootState) => state.user);
  return (
    <div>
      <div className="my-0 wallet-overview-header-main bg_cover_dashboard">
        <div className="profle-are-top container-4xl">
          <h2 className="wallet-overview-header-title">{title}</h2>
          {description && (
            <p className="text-white max-w-80-p">{description}</p>
          )}
        </div>
        {isLoggedIn && <StakingHeaderMenuTab />}
      </div>
    </div>
  );
}
