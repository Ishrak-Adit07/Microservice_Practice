const validateFields = (fields) => {
    for (const field of fields) {
      if (!field) {
        throw new Error("All fields are required");
      }
    }
  };
  
  const makePayment = async (name, payment) => {
  
    validateFields([name, payment]);
    const token = localStorage.getItem("webToken");
  
    try {
      const response = await fetch(`${import.meta.env.VITE_PAYMENT_API_URL}/api/payment/make`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ name, payment }),
      });
  
      const responseData = await response.json();
      if (!response.ok) {
        throw Error(responseData.error);
      }
  
      return responseData;
    } catch (error) {
      console.error("Error:", error.message);
      throw Error(error.message);
    }
  };
  
  export { makePayment };