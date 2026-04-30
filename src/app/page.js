import { useSession } from "next-auth/react";
import DashboardPage from "./api/dashboard/page";
export default function Home() {
  const session = useSession();
  return (
    <>
      {session.status === "authenticated" ? (
        <DashboardPage />
      ) : (
        <div className="flex justify-center items-center h-screen">
          <h1 className="text-2xl font-bold">
            Please login to access the dashboard
          </h1>
        </div>
      )}
    </>
  );
}
