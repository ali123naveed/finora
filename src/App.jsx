import { SignedOut, SignedIn, SignIn, UserButton } from "@clerk/clerk-react";

function App() {
  return (
    <header>
      <SignedOut>
        <SignIn />
      </SignedOut>

      <SignedIn>
        <UserButton />
      </SignedIn>
    </header>
  );
}

export default App;
