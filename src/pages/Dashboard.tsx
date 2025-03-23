import { useAuth } from "@/contexts/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();
  return (
    <div className="text-2xl text-white">
      Welcome, {user?.name}
    </div>
  );
}
