import { useContext, useState } from "react";
import Alert from "../../messages/Alert";
import Success from "../../messages/Success";
import { makePayment } from "../../controllers/payment.controller";
import { UserContext } from "../../contexts/UserContext";

const MakePayment = () => {
  const [payment, setPayment] = useState("");
  const succesMessage = "Payment done successfully";

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const { user } = useContext(UserContext);
  // const navigate = useNavigate();

  const hanldeMakePayment = async() => {

    try {
        const responseData = await makePayment(user.name, payment);

        if(responseData){
            setSuccess(true);
            setError(null);
        }
          
      } catch (err) {
        setError(err.message);
        console.log(error);
      }

    setPayment();
  };

  const handleOk = () =>{
    setSuccess(false);
    setError(null);
  }
  return (
    <div className="my-20">
      <div className="bg-gradient-to-r from-purple-400 to-blue-400 py-10 px-4 rounded-lg shadow-md">
        <h1 className="text-xl text-left text-slate-700 text-semibold my-2">
          Make Payment
        </h1>
        <div>
          <input
            type="number"
            placeholder="Enter payment amount"
            className="input"
            autoFocus
            value={payment}
            onChange={(e) => setPayment(e.target.value)}
          />

          <button className="btn mt-2" onClick={hanldeMakePayment}>
            Make Payment
          </button>
        </div>

        <div>
          {error && <Alert msg={error.message} />}
          {success && <Success msg={succesMessage} />}
        </div>

        <div>
          {(error || success) && <button className="btn mt-2" onClick={handleOk}>
            Ok
          </button>}
        </div>
      </div>
    </div>
  );
};

export default MakePayment;