import { Button } from "../ui/button";

export default function LoginScreen() {
  return (
    <div className="min-h-screen w-full justify-center items-center flex flex-col space-y-4">
      <h2 className="text-4xl tracking-[-1.5px] font-bold">Welcome back</h2>
      <Button>Login</Button>
    </div>
  );
}
