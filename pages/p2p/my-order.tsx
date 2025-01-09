import Footer from "components/common/footer";
import SectionLoading from "components/common/SectionLoading";
import PlaceBottomRight from "components/gradient/placeBottomRight";
import PlaceTopLeft from "components/gradient/placeTopLeft";
import MarketOverviewHeader from "components/markets/MarketOverviewHeader";
import { P2pTopBar } from "components/P2P/P2pHome/TopBar";
import { OrderFilter } from "components/P2P/P2pOrder/OrderFilter";
import { OrderTable } from "components/P2P/P2pOrder/OrderTable";
import { SSRAuthCheck } from "middlewares/ssr-authentication-check";
import { GetServerSideProps } from "next";
import useTranslation from "next-translate/useTranslation";
import { useEffect, useState } from "react";
import { myP2pDisputeAction, myP2pOrderAction } from "state/actions/p2p";

const P2pOrder = () => {
  const [selectedMenu, setselectedMenu] = useState<any>(1);
  const { t } = useTranslation("common");

  return (
    <>
      <div>
        <MarketOverviewHeader title={t(`My Orders`)} />

        <P2pTopBar />
        <PlaceTopLeft />
        <PlaceBottomRight />
        <div className="glass-color-bg-custom backdrop-filter-none">
          <div className="container-4xl">
            <div className="row">
              <div className="col-12">
                <ul className="d-flex p2pTabList py-3 tableRow">
                  <li
                    onClick={() => {
                      setselectedMenu(1);
                    }}
                  >
                    <a
                      className={`${
                        selectedMenu === 1 && "p2pOrderTabListActive"
                      }`}
                    >
                      {t(`All Orders`)}
                    </a>
                  </li>
                  <li
                    onClick={() => {
                      setselectedMenu(2);
                    }}
                  >
                    <a
                      className={`${
                        selectedMenu === 2 && "p2pOrderTabListActive"
                      }`}
                    >
                      {t(`Disputed Orders`)}
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="glass-color-bg-custom backdrop-filter-none">
          {selectedMenu === 1 && (
            <OrderTable actionFunction={myP2pOrderAction} filter={true} />
          )}
          {selectedMenu === 2 && (
            <OrderTable actionFunction={myP2pDisputeAction} />
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};
export const getServerSideProps: GetServerSideProps = async (ctx: any) => {
  await SSRAuthCheck(ctx, "/p2p");

  return {
    props: {},
  };
};
export default P2pOrder;
