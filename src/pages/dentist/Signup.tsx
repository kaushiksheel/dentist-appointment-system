import AddDentistForm from "@/components/forms/AddDentistForm";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const Signup = () => {
  return (
    <div className="grid h-screen w-screen place-content-center">
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-medium">Signup</h2>
        </CardHeader>
        <CardContent>
          <AddDentistForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default Signup;
