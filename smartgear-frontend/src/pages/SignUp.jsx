import { useState } from "react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { Alert, AlertDescription } from "../components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";
import { register as apiRegister } from "../services/api";
import { useAuth } from "../context/AuthContext";

function SignUp() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
    // Clear error when user starts typing
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Client-side validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      const registrationData = {
        fullName: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        phone: formData.phone,
      };

      const response = await apiRegister(registrationData);
      
      if (response.status === 'success') {
        // Use auth context to handle login
        login(response.data.user, {
          accessToken: response.data.accessToken,
          refreshToken: response.data.refreshToken
        });
        
        // Check for redirect URL
        const redirectUrl = sessionStorage.getItem('redirectAfterLogin');
        const checkoutFromCart = sessionStorage.getItem('checkoutFromCart');
        
        if (redirectUrl) {
          sessionStorage.removeItem('redirectAfterLogin');
          if (checkoutFromCart) {
            sessionStorage.removeItem('checkoutFromCart');
            // For cart checkout, pass the state
            navigate(redirectUrl, { state: { fromCart: true } });
          } else {
            navigate(redirectUrl);
          }
        } else {
          // Default redirect to home page
          navigate('/');
        }
      } else {
        setError(response.message || 'Registration failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex items-center mx-auto justify-center p-3 md:p-12 flex-1">
        <div className="w-full max-w-md flex items-center mx-auto justify-center">
          <Card className="w-full max-w-sm">
            <CardHeader>
              <CardTitle className="text-2xl text-center font-bold">
                Create Account
              </CardTitle>
              <CardDescription className="text-center">
                Enter your information to get started.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <div className="flex flex-col gap-6">
                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="flex items-center gap-4">
                    <div className="flex flex-col flex-1">
                      <Label htmlFor="firstName" className="mb-2">
                        First name
                      </Label>
                      <Input
                        id="firstName"
                        type="text"
                        placeholder="John"
                        required
                        value={formData.firstName}
                        onChange={handleInputChange}
                        disabled={loading}
                      />
                    </div>
                    <div className="flex flex-col flex-1">
                      <Label htmlFor="lastName" className="mb-2">
                        Last name
                      </Label>
                      <Input
                        id="lastName"
                        type="text"
                        placeholder="Doe"
                        required
                        value={formData.lastName}
                        onChange={handleInputChange}
                        disabled={loading}
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
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={loading}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="0241234567"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      disabled={loading}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      required
                      value={formData.password}
                      onChange={handleInputChange}
                      disabled={loading}
                      minLength={6}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      required
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      disabled={loading}
                      minLength={6}
                    />
                  </div>
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex-col gap-2">
              <Button 
                type="submit" 
                className="w-full" 
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Create an account"
                )}
              </Button>
              <div className="flex items-center justify-center mt-2">
                <p className="text-sm text-muted-foreground text-center">
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
      <div className="mx-auto flex items-center justify-center pb-6">
        <p className="text-sm text-muted-foreground mt-4 text-center px-4">
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