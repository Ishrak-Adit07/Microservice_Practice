/* eslint-disable no-unused-vars */

import MakeDownload from "../../sections/download_sections/MakeDownload";
import MakePayment from "../../sections/payment_sections/MakePayment";

const Dashboard = () => {
  return (
    <section className="card">
      <h1 className="title text-center mb-20">User Dashboard</h1>

      <div>
        {
          <div>
            <h1 className="text-4xl font-bold text-center">This is user dashboard</h1>
            <MakePayment />
            <MakeDownload />
          </div>
        }
      </div>
    </section>
  );
};

export default Dashboard;
