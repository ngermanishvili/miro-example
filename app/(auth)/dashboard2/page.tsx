import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { SignOut } from "@/app/(auth)/(components)/sign-out";
const DashboardPage = async () => {
  return (
    <div>
      <h1>Dashboard</h1>
      <SignOut />
    </div>
  );
};

export default DashboardPage;
