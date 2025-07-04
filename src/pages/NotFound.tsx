
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
      <div className="text-center space-y-6 p-8">
        <div className="space-y-2">
          <h1 className="text-6xl font-bold text-slate-800 dark:text-slate-200">404</h1>
          <h2 className="text-2xl font-semibold text-slate-600 dark:text-slate-400">Page Not Found</h2>
          <p className="text-slate-500 dark:text-slate-500">The page you're looking for doesn't exist.</p>
        </div>
        
        <div className="flex gap-4 justify-center">
          <Button asChild className="gap-2">
            <Link to="/">
              <Home className="h-4 w-4" />
              Go Home
            </Link>
          </Button>
          <Button variant="outline" onClick={() => window.history.back()} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
