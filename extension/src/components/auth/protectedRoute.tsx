import { useAuth } from "@clerk/chrome-extension";

type ProtectedRouteProps = {
  children: React.ReactNode;
};

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return <p>Checking authentication...</p>;
  }

  if (!isSignedIn) {
    return (
      <div>
        <p>Please sign in to use Reoverlay.</p>
        <a href="http://localhost:3000/sign-in" target="_blank">
          Sign in
        </a>
      </div>
    );
  }

  return <>{children}</>;
}
