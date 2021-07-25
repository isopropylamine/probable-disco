const Letter = ({displayValue, glow}) => {

  return (
    <div className={glow ? "letter-display glow" : "letter-display"}>
      {displayValue}
    </div>
  );
};

export default Letter;
