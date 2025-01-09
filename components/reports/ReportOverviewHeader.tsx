import React from "react";
import ReportTabMenu from "./ReportTabMenu";

export default function ReportOverviewHeader({ title, imageUrl }: any) {
  return (
    <div className="my-0 report-overview-header-main bg_cover_dashboard">
      <div className="profle-are-top container-4xl">
        <h2 className="wallet-overview-header-title">{title}</h2>
      </div>
      <ReportTabMenu />
    </div>
  );
}
