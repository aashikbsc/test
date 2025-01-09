import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import { CgProfile } from "react-icons/cg";
import { MdDashboardCustomize, MdPassword } from "react-icons/md";
import { FaPeopleArrows } from "react-icons/fa";

import { BiSupport, BiShapeCircle } from "react-icons/bi";

import { useRouter } from "next/router";
import { RootState } from "state/store";
import { useSelector } from "react-redux";
const FiatMenuNav = () => {
  const router = useRouter();
  const { t } = useTranslation("common");
  const { settings } = useSelector((state: RootState) => state.common);

  return (
    <div className="container-4xl">
      <ul className="wallet-overview-tab-menu">
        <Link href="/fiat-deposit">
          <li className={router.pathname == "/fiat-deposit" ? "active" : ""}>
            <a href="/fiat-deposit">{t("Fiat To Crypto Deposit")}</a>
          </li>
        </Link>
        <Link href="/fiat-withdrawal">
          <li className={router.pathname == "/fiat-withdrawal" ? "active" : ""}>
            <a href="/fiat-withdrawal">{t("Crypto To Fiat Withdrawal")}</a>
          </li>
        </Link>
      </ul>
    </div>
  );
};

export default FiatMenuNav;
