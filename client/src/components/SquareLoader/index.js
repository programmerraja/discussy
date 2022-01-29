import React from "react";

import "./style.css";

function SquareLoader(props) {
  return (
    <div
      className={
        props.position ? "loader-wrapper position-static" : "loader-wrapper"
      }
      style={
        props.loading
          ? { display: "flex", marginTop: "0", ...props.style }
          : { display: "none", ...props.style }
      }
    >
      <div className="square-loader">
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
}

export default SquareLoader;
