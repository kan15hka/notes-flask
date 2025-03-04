import { useState } from "react";
import InputField from "../../components/InputField";
import { Link, useNavigate } from "react-router-dom";
import {
  isValidPassword,
  isValidUsername,
  toastType,
} from "../../helper/helper";
import { axiosInstance } from "../../apis/axiosInstance";
import Toast from "../../components/Toast";
import { useAuth } from "../../context/AuthContext";
export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState({
    isShown: false,
    message: "",
    type: toastType.SUCCESS,
  });
  const onToastClose = () => {
    setShowToast({ isShown: false, message: "", type: toastType.NULL });
  };

  const { loadUser } = useAuth();
  const navigate = useNavigate();

  const loginUser = async (e) => {
    e.preventDefault();
    setError("");

    if (
      !isValidUsername({ username, setError }) ||
      !isValidPassword({ password, setError })
    )
      return;

    try {
      const userFormData = { username: username, password: password };
      const response = await axiosInstance.post("/login", userFormData);

      if (response?.data?.message) {
        const id = response.data.id;
        const username = response.data.username;
        const accessToken = response.data.access_token;
        const refreshToken = response.data.refresh_token;
        const userResponse = {
          id: id,
          username: username,
          accessToken: accessToken,
          refreshToken: refreshToken,
        };
        //Load user data into context and local storage
        loadUser(userResponse);
        console.log(response.data.message);
        setShowToast({
          isShown: true,
          message: response.data.message || "Login successfull",
          type: toastType.SUCCESS,
        });
        setTimeout(() => {
          navigate("/home");
        }, 1500);
      }
    } catch (error) {
      console.log(error);
      setShowToast({
        isShown: true,
        message: error?.response?.data.message || "Login Failed",
        type: toastType.ERROR,
      });
    }
  };

  return (
    <div>
      <div className="h-screen w-screen flex justify-center items-center ">
        <div className="p-4 border-2 border-black rounded-md w-96">
          <form action="" onSubmit={loginUser}>
            <p className="mb-3 text-lg font-semibold">Login</p>
            <InputField
              isPasswordField={false}
              value={username}
              setValue={setUsername}
              placeholder="UserName"
            />
            <InputField
              isPasswordField={true}
              value={password}
              setValue={setPassword}
              placeholder="Password"
            />
            {error && <p className="text-red-600 text-xs mb-2">{error}</p>}
            <button
              type="submit"
              className="w-full bg-black rounded-sm text-white p-2"
            >
              Login
            </button>
          </form>
          <div className="mt-3 flex justify-center gap-2 text-sm ">
            <p>Dont have an account?</p>
            <Link to="/signup" className="font-semibold">
              Register
            </Link>
          </div>
        </div>
      </div>
      <Toast
        isShown={showToast.isShown}
        message={showToast.message}
        type={showToast.type}
        onClose={onToastClose}
      />
    </div>
  );
}
