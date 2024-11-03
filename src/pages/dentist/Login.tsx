import LoginCard from "@/components/LoginCard";
import { DUMMY_USERS } from "@/data/dummy-users";
import { useToast } from "@/hooks/use-toast";
import { auth } from "@/lib/firebase";
import { FirebaseError } from "firebase/app";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const handleLogin = async (email: string, password: string) => {
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);

      if (user) {
        navigate("/dentist/dashboard");
      }
    } catch (error) {
      if (error instanceof FirebaseError) {
        toast({
          title: error?.message,
          variant: "destructive",
        });
      }
    }
  };
  return (
    <div className="grid h-screen w-screen place-content-center">
      <LoginCard onSubmit={handleLogin} dummyUser={DUMMY_USERS.DENTIST} />
    </div>
  );
};

export default Login;
