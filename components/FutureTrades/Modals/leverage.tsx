import RangeSlider from "components/dashboard/RangeSlider";
import useTranslation from "next-translate/useTranslation";
import React, { useEffect, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { toast } from "react-toastify";

const Leverage = ({ leverage, setLeverage, dashboard }: any) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { t } = useTranslation("common");

  const toggle = () => {
    if (leverage <= 0) {
      toast.error(`No Leverage is available for this Coin Pair.`);
      return;
    }
    setIsModalOpen(!isModalOpen);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {}, [dashboard?.order_data?.max_leverage]);

  return (
    <>
      <div
        id=""
        data-toggle="pill"
        role="tab"
        aria-controls="pills-transfer-1"
        aria-selected="true"
        onClick={toggle}
        className={`modal-button-future`}
      >
        {leverage}x
      </div>
      {isModalOpen && (
        <div id="demo-modal" className="gift-card-modal">
          <div className="future-modal__content section-padding-custom">
            <h3>Leverage</h3>
            <div className="leverage-section">{leverage}x</div>
            <div className="mt-5 mb-3">
              <RangeSlider
                value={leverage}
                setValue={setLeverage}
                sufix="x"
                min={1}
                max={100}
              />
            </div>
            <div>
              <button
                className="primary-btn w-98-p margin-2"
                onClick={closeModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Leverage;
