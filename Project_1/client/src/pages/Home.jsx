/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import MakePayment from "../sections/payment_sections/MakePayment";
import MakeDownload from "../sections/download_sections/MakeDownload";

const Home = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(async () => {
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <section className="card">
      <h1 className="title text-center">Home page</h1>

      <div>
        {loading && (
          <i className="fa-solid fa-spinner animate-spin text-3xl text-center-block"></i>
        )}

        {!loading && 
          <div>
            <h1 className="text-center text-2xl text-blue-700">Winter is coming</h1>
          </div>}
      </div>
    </section>
  );
};

export default Home;
 