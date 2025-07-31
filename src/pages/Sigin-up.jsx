
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

function SignUp() {
  return (
    <div>
      <div className=" max-h-screen flex flex-col ">
        <div className="flex items-center mx-auto justify-center p-3 md:p-12">
          <div className="w-full max-w-md flex items-center max-h-screen mx-auto justify-center ">
            <Card className="w-full max-w-sm">
              <CardHeader>
                <CardTitle className="text-2xl  text-center font-bold">
                  Create Account
                </CardTitle>
                <CardDescription className="text-center">
                  Enter your information to get started.{" "}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form>
                  <div className="flex flex-col gap-6 ">
                    <div className=" flex items-center  gap-6 ">
                      <div className="flex flex-col">
                        <Label htmlFor="email" className=" mb-2">
                          First name
                        </Label>
                        <Input
                          id="firstname"
                          type="text"
                          placeholder="John"
                          required
                          className="px-12 "
                        />
                      </div>
                      <div className="flex flex-col">
                        <Label htmlFor="lastname" className="mb-2">
                          Last name
                        </Label>
                        <Input
                          id="lastname"
                          type="text"
                          placeholder="Doe"
                          required
                          className="px-12 "
                        />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="m@example.com"
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <div className="flex items-center">
                        <Label htmlFor="password">Password</Label>
                      </div>
                      <Input id="password" type="password" required />
                    </div>
                  </div>
                </form>
              </CardContent>
              <CardFooter className="flex-col gap-2">
                <Button type="submit" className="w-full ">
                  Create an account
                </Button>
                <div className="flex items-center justify-center mt-2 ">
                  <p className="text-sm text-muted-foreground  text-center">
                    Already have an account?
                  </p>
                  <Link to="/login">
                    <Button variant="link" className="text-red-400 underline">
                      Login
                    </Button>
                  </Link>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
      <div className="mx-auto flex items-center justify-center">
        <p className="text-sm text-muted-foreground mt-4">
          By signing up, you agree to our{" "}
          <a href="#" className="text-primary hover:underline">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="text-primary hover:underline">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
}
export default SignUp;
