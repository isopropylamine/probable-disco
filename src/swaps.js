const Swap = ({swapObject, glow}) => {
  return (
    <div
      className={glow ? "swap-object glow" : "swap-object"}
    >{`${swapObject.from},${swapObject.to}`}</div>
  );
};

export default Swap;
