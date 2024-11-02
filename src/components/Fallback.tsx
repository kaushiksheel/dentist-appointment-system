import React from "react";
import Spinner from "./Spinner";

const Fallback = () => {
  return (
    <div className="grid h-screen w-screen place-content-center">
      <Spinner />
    </div>
  );
};

export default Fallback;
