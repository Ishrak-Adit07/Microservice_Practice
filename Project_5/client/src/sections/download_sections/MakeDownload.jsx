import { useContext, useState } from "react";
import Alert from "../../messages/Alert";
import Success from "../../messages/Success";
import { UserContext } from "../../contexts/UserContext";
import { makeDownload } from "../../controllers/download.controller";

const MakeDownload = () => {

  const succesMessage = "Download done successfully";

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const { user } = useContext(UserContext);
  // const navigate = useNavigate();

  const hanldeMakeDownload = async() => {

    try {
        const responseData = await makeDownload(user.name);

        if(responseData){
            setSuccess(true);
            setError(null);
        }
          
      } catch (err) {
        setError(err.message);
        console.log(error);
      }

  };

  const handleOk = () =>{
    setSuccess(false);
    setError(null);
  }
  return (
    <div className="my-20">
      <div className="bg-gradient-to-r from-purple-400 to-blue-400 py-10 px-4 rounded-lg shadow-md">
        <h1 className="text-xl text-left text-slate-700 text-semibold my-2">
          Make Download
        </h1>
        <div>
          <button className="btn mt-2" onClick={hanldeMakeDownload}>
            Download
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

export default MakeDownload;