
import { Toaster } from "./components/ui/toaster";
import { AllExpenses } from "./pages/AllExpenses";
import { CreateExpense } from "./pages/CreateExpense";
import { TotalSpent } from "./pages/TotalSpent";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ExpenseDetail } from "./pages/ExpenseDetail";

function App() {
  return (
    <Router>
      <div className="max-w-xl m-auto">
        <TotalSpent />
        <Routes>
          <Route path="/" element={<AllExpenses />} />
          <Route path="/expenses/:id" element={<ExpenseDetail />} />
        </Routes>
        <CreateExpense />
        <Toaster />
      </div>
    </Router>
  );
}

export default App;
