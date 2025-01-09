import React from "react";

import AreaCharts from "./AreaCharts";
import PieCharts from "./PieCharts";
import PieChartsWithNeddle from "./PieChartsWithNeddle";
import HighestSearchedLists from "./HighestSearchedLists";
import ListCharts from "./ListCharts";

export default function TopCharts({ tradeDatas }: any) {
  return (
    <div className="row body-margin-top-custom row-gap-20">
      <div className="col-lg-3 col-md-6">
        <div className="shadow-sm">
          <AreaCharts tradeDatas={tradeDatas} />
        </div>
      </div>
      <div className="col-lg-3 col-md-6">
        <div className="shadow-sm">
          <PieCharts tradeDatas={tradeDatas} />
        </div>
      </div>
      <div className="col-lg-3 col-md-6 ">
        {/* <PieChartsWithNeddle /> */}
        <div className="shadow-sm">
          <ListCharts tradeDatas={tradeDatas} />
        </div>
      </div>
      <div className="col-lg-3 col-md-6">
        <div className="shadow-sm">
          <HighestSearchedLists tradeDatas={tradeDatas} />
        </div>
      </div>
    </div>
  );
}
