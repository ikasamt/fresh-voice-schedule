import { useEffect, useState } from "preact/hooks";
import { IS_BROWSER } from "$fresh/runtime.ts";
import LoginScreen from "./LoginScreen.tsx";
import TimelineScreen from "./TimelineScreen.tsx";
import { 
  auth, 
  subscribeToAuthState,
  type User 
} from "../utils/firebase.ts";

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!IS_BROWSER) return;
    
    const unsubscribe = subscribeToAuthState((user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div class="min-h-screen flex items-center justify-center bg-gray-50">
        <div class="text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p class="mt-4 text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  return user ? <TimelineScreen user={user} /> : <LoginScreen />;
}