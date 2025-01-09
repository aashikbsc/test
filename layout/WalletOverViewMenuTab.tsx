import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import { CgProfile } from "react-icons/cg";
import { MdDashboardCustomize, MdPassword } from "react-icons/md";
import { FaPeopleArrows } from "react-icons/fa";

import { BiSupport, BiShapeCircle } from "react-icons/bi";

import { useRouter } from "next/router";
import { RootState } from "state/store";
import { useSelector } from "react-redux";
const WalletOverViewMenuTab = () => {
  const router = useRouter();
  const { t } = useTranslation("common");
  const { settings } = useSelector((state: RootState) => state.common);

  return (
    <div className="container-4xl">
      <ul className="wallet-overview-tab-menu">
        <Link href="/wallet-overview">
          <li className={router.pathname == "/wallet-overview" ? "active" : ""}>
            <a>{t("Overview")}</a>
          </li>
        </Link>
        <Link href="/user/my-wallet">
          <li className={router.pathname == "/user/my-wallet" ? "active" : ""}>
            <a>{t("Spot")}</a>
          </li>
        </Link>
        {Number(settings?.enable_future_trade) === 1 && (
          <Link href="/futures/wallet-list">
            <li
              className={
                router.pathname == "/futures/wallet-list" ? "active" : ""
              }
            >
              <a>{t("Futures")}</a>
            </li>
          </Link>
        )}

        {parseInt(settings.p2p_module) === 1 && (
          <Link href="/p2p/p2p-wallet">
            <li
              className={router.pathname == "/p2p/p2p-wallet" ? "active" : ""}
            >
              <a>{t("P2P")}</a>
            </li>
          </Link>
        )}
        <Link href={`/user/check-deposit`}>
          <li>
            <a>Check Deposit</a>
          </li>
        </Link>
        <Link href={`/user/wallet-history?type=deposit`}>
          <li>
            <a>Deposit History</a>
          </li>
        </Link>
        <Link href={`/user/wallet-history?type=withdrawal`}>
          <li>
            <a>Withdrawal History</a>
          </li>
        </Link>
        <Link href={`/user/transaction-history`}>
          <li>
            <a>Transaction History</a>
          </li>
        </Link>
      </ul>
    </div>
  );
};

export default WalletOverViewMenuTab;
