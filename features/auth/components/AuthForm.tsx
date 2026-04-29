import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { login, signup } from "../actions/auth-actions";

export function AuthForm({ message }: { message?: string }) {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl text-center">
          AutoContent Studio
        </CardTitle>
        <CardDescription className="text-center">
          Enter your email below to login to your account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4">
          {message && (
            <div className="p-3 text-sm text-red-500 bg-red-100 rounded-md">
              {message}
            </div>
          )}
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="m@example.com"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              minLength={6}
            />
          </div>
          <CardFooter className="flex flex-col gap-2 p-0 mt-2">
            <Button className="w-full" formAction={login}>
              Log in
            </Button>
            <Button variant="outline" className="w-full" formAction={signup}>
              Sign up
            </Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
}
