import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";

function Login() {
  return (
    <div className=" -max-h-screen flex flex-col  ">
      <div className="flex items-center mx-auto justify-center p-3 md:px-12 md:py-3">
        <div className="w-full max-w-md flex items-center max-h-screen mx-auto justify-center ">
          <Card className="w-full min-w-sm  ">
            <CardHeader>
              <CardTitle className="text-2xl  text-center font-bold">
                Welcome Back
              </CardTitle>
              <CardDescription className="text-center">
                Enter your credentials to access your account.{" "}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form>
                <div className="flex flex-col gap-6  ">
                  <div className="grid gap-2 ">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      required
                      className="w-full px-20 "
                    />
                  </div>
                  <div className="grid gap-2">
                    <div className="flex items-center">
                      <Label htmlFor="password">Password</Label>
                      <a
                        href="#"
                        className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                      >
                        Forgot your password?
                      </a>
                    </div>
                    <Input id="password" type="password" required px-12 />
                  </div>
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex-col gap-2">
              <Button type="submit" className="w-full ">
                Login
              </Button>
              <div className="flex items-center justify-center mt-2 ">
                <p className="text-sm text-muted-foreground  text-center">
                  Don't have an account?
                </p>
                <Link to= "/sign-up">
                  <Button variant="link" className="text-red-400 underline">
                    Sign up
                  </Button>
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
export default Login;
