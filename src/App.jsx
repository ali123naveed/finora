import {
  SignedOut,
  SignedIn,
  SignIn,
  UserButton,
  useUser,
} from "@clerk/clerk-react";
import StockList from "./components/stockList";
import "./App.css";

function App() {
  const { user } = useUser();

  return (
    <div className="app-container">
      <header>
        <h2>Finora.io</h2>
        <h3>Track Your Investments</h3>
      </header>

      <SignedOut>
        <div className="welcome-message">
          <p>login to manage your stocks</p>
          <SignIn />
        </div>
      </SignedOut>

      <SignedIn>
        {user ? (
          <>
            <div className="user-header">
              <UserButton />
              <h4>Welcome, {user.firstName || user.username || "user"}! ✌</h4>
            </div>
            {user && <StockList userId={user.id} />}
          </>
        ) : (
          <p>Loading user data...</p>
        )}
      </SignedIn>
    </div>
  );
}

export default App;
