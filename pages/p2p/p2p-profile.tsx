import Footer from "components/common/footer";
import { P2pTopBar } from "components/P2P/P2pHome/TopBar";
import { TradeDetails } from "components/P2P/P2pProfile/TradeDetails";
import { FeedbackTable } from "components/P2P/P2pProfile/FeedbackTable";
import { ProfileHeader } from "components/P2P/P2pProfile/ProfileHeader";
import { PaymentTable } from "components/P2P/P2pProfile/PaymentTable";
import { SSRAuthCheck } from "middlewares/ssr-authentication-check";
import { GetServerSideProps } from "next";
import { useEffect, useState } from "react";
import { userCenterAction } from "state/actions/p2p";
import SectionLoading from "components/common/SectionLoading";
import useTranslation from "next-translate/useTranslation";
import MarketOverviewHeader from "components/markets/MarketOverviewHeader";
import PlaceBottomRight from "components/gradient/placeBottomRight";
import PlaceTopLeft from "components/gradient/placeTopLeft";

const P2pProfile = () => {
  const { t } = useTranslation("common");

  const [loading, setLoading] = useState(false);
  const [details, setDetails] = useState<any>();
  useEffect(() => {
    userCenterAction(setLoading, setDetails);
  }, []);
  return (
    <>
      <MarketOverviewHeader title={t(`User center`)} />
      {loading ? (
        <SectionLoading />
      ) : (
        <div className="">
          <P2pTopBar />
          <ProfileHeader details={details} />
          <PlaceTopLeft />
          <PlaceBottomRight />
          <TradeDetails details={details} />
          <div className="glass-color-bg-custom  pb-5 pt-3">
            <PaymentTable />
            <FeedbackTable details={details} />
          </div>
        </div>
      )}

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
export default P2pProfile;
