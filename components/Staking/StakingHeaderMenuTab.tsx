import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import { CgProfile } from "react-icons/cg";
import { MdDashboardCustomize, MdPassword } from "react-icons/md";
import { FaPeopleArrows } from "react-icons/fa";

import { BiSupport, BiShapeCircle } from "react-icons/bi";

import { useRouter } from "next/router";
import { RootState } from "state/store";
import { useSelector } from "react-redux";
const StakingHeaderMenuTab = () => {
  const router = useRouter();
  const { t } = useTranslation("common");

  return (
    <div className="container-4xl">
      <ul className="wallet-overview-tab-menu">
        <li>
          <Link href="/staking">
            <a>{t(`Home`)}</a>
          </Link>
        </li>
        <li>
          <Link href="/staking/earnings">
            <a>{t(`Reports`)}</a>
          </Link>
        </li>
        <li>
          <Link href="/staking/my-investments">
            <a>{t(`My Invesments`)}</a>
          </Link>
        </li>
        <li>
          <Link href="/staking/payment-list">
            <a>{t(`My Earnings`)}</a>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default StakingHeaderMenuTab;
