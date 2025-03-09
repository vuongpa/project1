import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { callPostAPI } from "../../api_utils";
import { motion } from "framer-motion";

// Define types for form data
interface IFormInput {
  username: string;
  password: string;
  confirmPassword: string;
}

const validationSchema = Yup.object().shape({
  username: Yup.string().required("Username is required").min(3, "Username must be at least 3 characters"),
  password: Yup.string().required("Password is required").min(6, "Password must be at least 6 characters"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), undefined], "Passwords must match")
    .required("Confirm password is required"),
});

export const Register = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm<IFormInput>({
    resolver: yupResolver(validationSchema),
  });
  const [_loading, setLoading] = React.useState(false);

  const mutation = useMutation({
    mutationFn: async (data: IFormInput) => {
      const registerResponse = await callPostAPI(
        "/register",
        {
          username: data.username,
          password: data.password,
        }
      );
      return registerResponse.data;
    },
    onSuccess: () => {
      toast.success("Registration successful!");
      setTimeout(() => {
        navigate("/auth/login");
      }, 1500);
    },
    onError: (error: any) => {
      if (error.response && error.response.status === 400) {
        toast.error("Username already exists. Please choose another name.");
      } else {
        toast.error("An error occurred. Please try again.");
      }
    },
  });

  // Handle form submission
  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    if (data.password !== data.confirmPassword) {
      toast.error("Passwords do not match. Please try again.");
      return;
    }

    setLoading(true);
    mutation.mutate(data);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      transition={{
        duration: 1,
        ease: "easeInOut"
      }}
    >

      <div className="relative min-h-screen">
        <img
          src="/images/header_img/Group 12519.png"
          alt="Logo"
          className="absolute top-3 left-3 w-14 h-auto z-50"
        />

        <div className="flex min-h-screen bg-gray-100">
          <div className="hidden md:flex w-3/5 bg-gradient-to-tr from-black justify-center items-center relative">
            <div className="absolute inset-0 bg-black opacity-50"></div>
            <div className="z-10 text-white text-center w-full h-full flex justify-center items-center">
              <div className="flex flex-col items-start space-y-8">
                <div className="flex flex-col items-start space-y-2">
                  <h1 className="font-extrabold text-6xl text-left">Ranoar <br /> No-Code</h1>
                  <div className="font-normal text-3xl">A No-code website builder</div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 w-full md:w-2/5 flex justify-center items-center p-6 md:p-12">
            <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md bg-white rounded-lg p-8 shadow-lg min-h-[450px]">
              <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Register</h1>
              <div className="mb-6">
                <label htmlFor="username" className="block text-sm font-medium text-gray-600 mb-2">Username</label>
                <input type="text" id="username" {...register("username")} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter your username" />
                {errors.username && <span className="text-red-500 text-sm">{errors.username.message}</span>}
              </div>
              <div className="mb-6">
                <label htmlFor="password" className="block text-sm font-medium text-gray-600 mb-2">Password</label>
                <input type="password" id="password" {...register("password")} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter your password" />
                {errors.password && <span className="text-red-500 text-sm">{errors.password.message}</span>}
              </div>
              <div className="mb-6">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-600 mb-2">Confirm Password</label>
                <input type="password" id="confirmPassword" {...register("confirmPassword")} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Confirm your password" />
                {errors.confirmPassword && <span className="text-red-500 text-sm">{errors.confirmPassword.message}</span>}
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors">Register</button>
              <p className="text-center text-sm text-gray-500 mt-6">
                Already have an account?
                <span className="text-blue-600 hover:underline cursor-pointer" onClick={() => navigate("/auth/login")}>
                  Login
                </span>
              </p>
            </form>
          </div>
        </div>
      </div>
    </motion.div>
  );
};