import { Loader, Lock, Mail } from "lucide-react";
import Input from "../Components/Input";
//import toast from "react-hot-toast";
import { useState } from "react";
import { useAuthStore } from "../store/authStore";
import { Link } from "react-router-dom";

const LogInPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { login, isLoggingIn } = useAuthStore();

  const handleLogIn = (e) => {
    e.preventDefault();

    login(formData);
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden">
      <div className="bg-gray-900 lg:w-80 lg:h-[500px] sm:w-48 sm:h-52 md:h-[500px] md:w-96 rounded-lg border border-white p-6">
        <h2 className="text-center myfont text-white text-2xl mb-4">Log-in</h2>
        <form className="flex flex-col " onSubmit={handleLogIn}>
          <Input
            label="Email"
            icon={Mail}
            type="text"
            placeholder="example@gmail.com"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />

          <Input
            label="Password"
            icon={Lock}
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />

          <button
            type="submit"
            className="w-full bg-green-500 text-white mt-4 py-2 rounded-lg disabled:bg-gray-600"
            disabled={isLoggingIn}
          >
            {isLoggingIn ? (
              <>
                <Loader className="w-5 h-5 animate-spin inline-block mr-2" />
                Loading...
              </>
            ) : (
              "Log-in"
            )}
          </button>
        </form>
        <p className="text-center">
          Don t have an account?{" "}
          <Link to="/signup" className="link link-primary">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LogInPage;
