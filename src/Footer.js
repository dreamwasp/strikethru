import React from "react";

export const Footer = () => {
  return (
    <div className="thanks">
      <p>
        This app was built using the{" "}
        <span
          className="smallLink"
          onClick={() => {
            window.open("https://gnews.io/");
          }}
        >
          GNews API
        </span>
        .
      </p>
      <div className="symbol">☭</div>
    </div>
  );
};
