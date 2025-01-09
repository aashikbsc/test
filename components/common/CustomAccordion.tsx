import { FaAngleDown } from "react-icons/fa";
import { useState } from "react";

export const CustomAccordion = ({ faqIten }: any) => {
  const [faqDown, setFaqDown] = useState(true);
  const faqArrow = () => setFaqDown(!faqDown);

  return (
    <div className="accordion" id="accordionExample">
      <div className="card faqAccordion shadow-sm glass-color-bg-custom">
        <div className="card-header" id="headingThree">
          <button
            className="collapsed d-flex justify-content-between align-items-center glass-color-bg-custom"
            type="button"
            onClick={faqArrow}
            data-toggle="collapse"
            data-target={`#collapseThree${faqIten?.id}`}
            aria-expanded="false"
            aria-controls={`collapseThree${faqIten?.id}`}
          >
            {faqIten?.question}
            <FaAngleDown className={`${faqDown ? "faqDown" : ""}`} />
          </button>
        </div>
        <div
          id={`collapseThree${faqIten?.id}`}
          className="collapse"
          aria-labelledby="headingThree"
          data-parent="#accordionExample"
        >
          <div className="p-3">{faqIten?.answer}</div>
        </div>
      </div>
    </div>
  );
};
