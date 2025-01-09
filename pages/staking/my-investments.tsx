import { InvesmentOrderTable } from "components/Staking/MyOrders";
import StakingHeader from "components/Staking/StakingHeader";
import { StakingTopBar } from "components/Staking/common/TopBar";
import Footer from "components/common/footer";
import { SSRAuthCheck } from "middlewares/ssr-authentication-check";
import { GetServerSideProps } from "next";
import useTranslation from "next-translate/useTranslation";
import React from "react";
import { myOrderAction } from "state/actions/staking";

const MyOrder = () => {
  const { t } = useTranslation("common");

  return (
    <>
      <StakingHeader title={t(`My Invesments`)} />
      <InvesmentOrderTable actionFunction={myOrderAction} filter={true} />
      <Footer />
    </>
  );
};
export const getServerSideProps: GetServerSideProps = async (ctx: any) => {
  await SSRAuthCheck(ctx, "/staking");

  return {
    props: {},
  };
};
export default MyOrder;
