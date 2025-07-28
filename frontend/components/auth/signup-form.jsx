"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useRegister, useLogin } from "@/hooks/useNextAuth";
import toast from "react-hot-toast";

export function SignupForm() {
  const [form, setForm] = useState({
    firstname: "",
    middlename: "",
    lastname: "",
    gender: "",
    location: "",
    email: "",
    password: "",
    birthdate: "",
  });
  const router = useRouter();
  const registerMutation = useRegister();
  const loginMutation = useLogin();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (
      !form.firstname ||
      !form.lastname ||
      !form.email ||
      !form.password ||
      !form.birthdate ||
      !form.gender ||
      !form.location
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const userData = {
        email: form.email,
        password: form.password,
        userInfo: {
          firstName: form.firstname,
          middleName: form.middlename || undefined,
          lastName: form.lastname,
          gender: form.gender,
          birthDate: new Date(form.birthdate).toISOString(),
          location: form.location,
        },
      };

      await registerMutation.mutateAsync(userData);

      // Auto-login after successful registration
      try {
        await loginMutation.mutateAsync({
          usercred: form.email,
          password: form.password,
        });
        toast.success("Account created and logged in successfully!");
        router.push("/");
      } catch (loginError) {
        toast.success("Account created successfully! Please sign in.");
        router.push("/login");
      }
    } catch (error) {
      toast.error(error.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen min-w-full bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-0">
      <div className="w-full max-w-6xl h-screen grid lg:grid-cols-2 shadow-2xl rounded-3xl overflow-hidden bg-white">
        {/* Left Side - Image */}
        <div className="hidden lg:block relative overflow-hidden h-full">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-transparent to-purple-800/20 z-10"></div>
          <img
            src="https://plus.unsplash.com/premium_photo-1723028769916-a767a6b0f719?q=80&w=435&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Modern workspace"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent z-20"></div>
          <div className="absolute bottom-8 left-8 right-8 z-30 text-white">
            <div className="flex items-center mb-4">
              <span className="text-4xl mr-3">🐻</span>
              <h1 className="text-3xl font-bold">ShareBear</h1>
            </div>
            <p className="text-lg text-white/90 max-w-md">
              Share memes, memories, and moments with friends
            </p>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="flex items-center justify-center h-full w-full overflow-y-auto">
          <div className="w-full max-w-md mx-auto space-y-6 max-h-screen overflow-y-auto py-8">
            <Card className="border-0 shadow-none">
              <CardHeader className="text-center space-y-2 pb-6">
                <CardTitle className="text-3xl font-bold text-blue-500">
                  Create Account
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Sign up to join ShareBear
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="firstname"
                        className="text-sm font-medium text-gray-700"
                      >
                        First Name
                      </Label>
                      <Input
                        id="firstname"
                        name="firstname"
                        type="text"
                        placeholder="Enter your first name"
                        value={form.firstname}
                        onChange={handleChange}
                        className="h-12 border-gray-400 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
                        required
                        autoComplete="given-name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="middlename"
                        className="text-sm font-medium text-gray-700"
                      >
                        Middle Name (optional)
                      </Label>
                      <Input
                        id="middlename"
                        name="middlename"
                        type="text"
                        placeholder="Enter your middle name"
                        value={form.middlename}
                        onChange={handleChange}
                        className="h-12 border-gray-400 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
                        autoComplete="additional-name"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="lastname"
                        className="text-sm font-medium text-gray-700"
                      >
                        Last Name
                      </Label>
                      <Input
                        id="lastname"
                        name="lastname"
                        type="text"
                        placeholder="Enter your last name"
                        value={form.lastname}
                        onChange={handleChange}
                        className="h-12 border-gray-400 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
                        required
                        autoComplete="family-name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="gender"
                        className="text-sm font-medium text-gray-700"
                      >
                        Gender
                      </Label>
                      <select
                        id="gender"
                        name="gender"
                        value={form.gender}
                        onChange={handleChange}
                        className="h-12 border border-gray-400 focus:border-blue-500 focus:ring-blue-500 focus:ring-1 focus:outline-none transition-all duration-200 rounded-md w-full px-3 bg-white text-gray-900"
                        required
                        aria-label="Select your gender"
                      >
                        <option value="">Select gender</option>
                        <option value="MALE">Male</option>
                        <option value="FEMALE">Female</option>
                        <option value="OTHER">Other</option>
                        <option value="UNSPECIFIED">Prefer not to say</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="location"
                      className="text-sm font-medium text-gray-700"
                    >
                      Location
                    </Label>
                    <Input
                      id="location"
                      name="location"
                      type="text"
                      placeholder="Enter your location"
                      value={form.location}
                      onChange={handleChange}
                      className="h-12 border-gray-400 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
                      required
                      autoComplete="address-level2"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className="text-sm font-medium text-gray-700"
                    >
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      value={form.email}
                      onChange={handleChange}
                      className="h-12 border-gray-400 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
                      required
                      autoComplete="email"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="password"
                      className="text-sm font-medium text-gray-700"
                    >
                      Password
                    </Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="Create a password"
                      value={form.password}
                      onChange={handleChange}
                      className="h-12 border-gray-400 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
                      required
                      autoComplete="new-password"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="birthdate"
                      className="text-sm font-medium text-gray-700"
                    >
                      Birthdate
                    </Label>
                    <Input
                      id="birthdate"
                      name="birthdate"
                      type="date"
                      value={form.birthdate}
                      onChange={handleChange}
                      className="h-12 border-gray-400 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
                      required
                      autoComplete="bday"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={registerMutation.isPending}
                    className="w-full h-12 bg-blue-500 hover:bg-blue-700 hover:cursor-pointer text-white font-medium 
                    rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {registerMutation.isPending ? "Signing up..." : "Sign Up"}
                  </Button>
                </form>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <Separator className="w-full bg-gray-400" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="bg-white px-4 text-gray-500">
                      or sign up with
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 w-full">
                  <Button
                    variant="outline"
                    className="flex-1 h-10 text-sm px-2 border-gray-300 hover:cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition-all duration-200"
                    disabled
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      x="0px"
                      y="0px"
                      width="100"
                      height="100"
                      viewBox="0 0 48 48"
                    >
                      <path
                        fill="#FFC107"
                        d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                      ></path>
                      <path
                        fill="#FF3D00"
                        d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                      ></path>
                      <path
                        fill="#4CAF50"
                        d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                      ></path>
                      <path
                        fill="#1976D2"
                        d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                      ></path>
                    </svg>
                    Google
                  </Button>
                  <span className="mx-1 text-gray-400 font-semibold text-xs select-none">
                    OR
                  </span>
                  <Button
                    variant="outline"
                    className="flex-1 h-10 text-sm px-2 hover:cursor-pointer border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all duration-200"
                    disabled
                  >
                    <svg
                      className="mr-2 h-4 w-4"
                      fill="#1877F3"
                      viewBox="0 0 24 24"
                    >
                      <path d="M22.675 0h-21.35C.595 0 0 .592 0 1.326v21.348C0 23.408.595 24 1.325 24h11.495v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.406 24 24 23.408 24 22.674V1.326C24 .592 23.406 0 22.675 0" />
                    </svg>
                    Facebook
                  </Button>
                </div>
                <div className="text-center text-sm">
                  <span className="text-gray-600">
                    Already have an account?{" "}
                  </span>
                  <button
                    onClick={() => (window.location.href = "/login")}
                    className="text-blue-600 hover:cursor-pointer hover:text-blue-800 hover:underline font-medium transition-colors"
                  >
                    Sign in
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
