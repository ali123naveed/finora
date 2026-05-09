import {
  SignedOut,
  SignedIn,
  SignIn,
  UserButton,
  useUser,
} from "@clerk/clerk-react";

import StockList from "./components/stockList";

function App() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return <p>Loading...</p>;
  }

  return (
    <header>
      <SignedOut>
        <SignIn />
      </SignedOut>

      <SignedIn>
        <UserButton />
        {user && <StockList userId={user.id} />}
      </SignedIn>
    </header>
  );
}

export default App;
