import React from "react";
import UserRegistrationForm from "@/components/user-registration/user-registration-form";

const ClientRegistrationPage = () => {
  return (
    <div className="flex mx-5 min-h-[calc(100vh-4rem)] items-center justify-center">
      <UserRegistrationForm />
    </div>
  );
};

export default ClientRegistrationPage;
