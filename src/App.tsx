import React, { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import Landing from './pages/Landing';
import SignIn from './pages/SignIn';
import Dashboard from './pages/Dashboard';
import { isSupabaseConfigured, supabase } from './lib/supabase';

const App: React.FC = () => {
  const [view, setView] = useState<'landing' | 'signin' | 'dashboard'>('landing');
  const [sessionUser, setSessionUser] = useState<User | null>(null);

  useEffect(() => {
    if (!supabase || !isSupabaseConfigured) {
      return;
    }
    const client = supabase;

    const bootstrapSession = async () => {
      const { data } = await client.auth.getSession();
      const user = data.session?.user ?? null;
      setSessionUser(user);
      setView(user ? 'dashboard' : 'landing');
    };

    bootstrapSession();

    const { data: subscription } = client.auth.onAuthStateChange((_event, session) => {
      const user = session?.user ?? null;
      setSessionUser(user);
      setView(user ? 'dashboard' : 'landing');
    });

    return () => {
      subscription.subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    if (supabase && isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    setSessionUser(null);
    setView('landing');
  };

  return (
    <div className="App">
      {view === 'landing' && (
        <Landing onSignInClick={() => setView('signin')} />
      )}

      {view === 'signin' && (
        <SignIn onBack={() => setView('landing')} />
      )}

      {view === 'dashboard' && sessionUser && (
        <Dashboard user={sessionUser} onSignOut={handleSignOut} />
      )}
    </div>
  );
};

export default App;
