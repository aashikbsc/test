import React from "react";

export default function RangeSlider({
  handleFunc,
  setValue,
  sufix,
  min,
  max,
  value,
}: any) {
  const [percent, setPercent] = React.useState<number>(value ? value : 0);

  return (
    <>
      <div className="d-flex align-items-center mt-4 mb-5">
        <input
          type="range"
          min={min}
          className="range-slider"
          max={max}
          value={percent}
          onChange={(event: any) => {
            setPercent(Number(event.target.value));
            if (handleFunc) {
              handleFunc(Number(event.target.value) / 100.0);
            }
            if (setValue) {
              setValue(Number(event.target.value));
            }
          }}
        />
        <label
          style={{ margin: 0, width: 40, fontSize: 16, textAlign: "right" }}
        >{`${percent}${sufix}`}</label>
      </div>
    </>
  );
}
