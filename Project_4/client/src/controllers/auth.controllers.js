const validateFields = (fields) => {
  for (const field of fields) {
    if (!field) {
      throw new Error("All fields are required");
    }
  }
};

const registerUser = async (name, password, confirmPassword) => {

  validateFields([name, password, confirmPassword]);

  if (password != confirmPassword) {
    throw Error("Passwords do not match");
  }

  try {
    const registerResponse = await fetch(`${import.meta.env.VITE_AUTH_API_URL}/api/user/register`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, password }),
    });

    const responseData = await registerResponse.json();

    if (!registerResponse.ok) {
      throw Error(responseData.error);
    }

    localStorage.setItem("webToken", responseData.webToken);
    localStorage.setItem("name", responseData.name);

    return responseData;
  } catch (error) {
    console.error("Error:", error.message);
    throw Error(error.message);
  }
};

const loginUser = async (name, password) => {

  validateFields([name, password]);

  try {
    const loginResponse = await fetch(`${import.meta.env.VITE_AUTH_API_URL}/api/user/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, password }),
    });

    const responseData = await loginResponse.json();

    if (!loginResponse.ok) {
      throw Error(responseData.error);
    }

    localStorage.setItem("webToken", responseData.webToken);
    localStorage.setItem("name", responseData.name);

    return responseData;
  } catch (error) {
    console.error("Error:", error.message);
    throw Error(error.message);
  }
};

export { registerUser, loginUser };