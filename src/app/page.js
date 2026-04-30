import { Dashboard } from "../../components/dashboard/dashboard";
import { useSession } from "next-auth/react";
export default function Home() {
  const session = useSession();
  return (
    <>
      {session.status === "authenticated" ? (
        <Dashboard />
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
