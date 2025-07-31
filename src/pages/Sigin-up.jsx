
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

function SignUp() {
  return (
    <div>
      <div className="  md:bg-gray-100 max-h-screen flex flex-col ">
        <div className="flex items-center mx-auto justify-center p-3 md:p-12">
          <div className="w-full max-w-md flex items-center max-h-screen mx-auto justify-center ">
            <Card className="w-full max-w-sm">
              <CardHeader>
                <CardTitle>Sign up to create an account</CardTitle>
                <CardDescription>
                  Enter your details below to create a new account
                </CardDescription>

                <Button variant="link">Login</Button>
              </CardHeader>
              <CardContent>
                <form>
                  <div className="flex flex-col gap-6 ">
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
                  Sign-up
                </Button>
                <Button variant="outline" className="w-full">
                  Sign-up with Google
                </Button>
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
