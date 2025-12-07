import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithCustomToken, onAuthStateChanged, signOut, signInAnonymously, updateProfile } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, collection, getDocs, onSnapshot, query } from 'firebase/firestore';
import { Menu, X, Home, Package, Gamepad2, Trophy, Users, Shield, LogOut, Globe, ChevronRight, User, Mail, Lock, ArrowRight } from 'lucide-react';

import { LanguageProvider, useTranslation } from './context/LanguageContext';
import { auth, db, appId, hashPassword } from './services/firebase';
import { AppUser } from './types';
import ChatBot from './components/ChatBot';
import { Match3Game, SnackSwipeGame, GameSelection } from './components/GameRoom';
import { DEFAULT_HOME_CONFIG } from './constants';

// --- SUB-COMPONENTS (Simplified for strict file count, but modular logic) ---

const JidoBudiLogo = ({ className }: { className?: string }) => (
  <div className={`flex flex-col items-center justify-center ${className}`}>
      <svg width="120" height="120" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-sm">
        <circle cx="60" cy="60" r="48" fill="none" stroke="#FDE047" strokeWidth="4" />
        <circle cx="60" cy="60" r="42" fill="none" stroke="#60A5FA" strokeWidth="4" />
        <circle cx="60" cy="60" r="36" fill="#000000" />
        <g transform="translate(45, 30)">
           <path d="M0 5 L5 0 L35 0 L35 48 L30 53 L0 53 Z" fill="#374151" transform="translate(-4, 2)" />
           <rect x="0" y="0" width="30" height="50" rx="3" fill="#F87171" stroke="#374151" strokeWidth="0.5" />
           <rect x="4" y="4" width="22" height="28" rx="1" fill="#111" />
           <rect x="23" y="34" width="4" height="12" rx="0.5" fill="#374151" opacity="0.4" />
           <rect x="4" y="38" width="16" height="6" rx="1" fill="#7F1D1D" />
        </g>
      </svg>
      <div className="-mt-2"><span className="font-bold text-2xl leading-none tracking-tight text-blue-400">JIDO BUDI</span></div>
  </div>
);

const Navbar = ({ user, onLogout, activePage, setActivePage }: any) => {
  const { language, setLanguage, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  
  const NavLink = ({ page, label, icon: Icon }: any) => (
    <button onClick={() => { setActivePage(page); setIsOpen(false); }} className={`flex items-center gap-2 font-medium text-sm transition-colors ${activePage === page ? 'text-white' : 'text-slate-400 hover:text-white'}`}>
        {Icon && <Icon size={16} />}{label}
    </button>
  );

  return (
    <nav className="fixed top-0 w-full z-50 px-6 h-16 bg-slate-900/90 backdrop-blur-md border-b border-white/5 flex items-center">
      <div className="max-w-7xl mx-auto w-full flex justify-between items-center h-full">
        <div className="flex items-center -ml-4 h-full"><button onClick={() => setActivePage('home')} className="p-1 hover:bg-white/10 transition-colors rounded-2xl flex items-center h-full"><JidoBudiLogo className="transform scale-[0.4] origin-left" /></button></div>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
            <NavLink page="home" label={t('nav_home')} icon={Home} />
            <NavLink page="products" label={t('nav_products')} icon={Package} />
            <NavLink page="game" label={t('nav_game')} icon={Gamepad2} />
            <NavLink page="leaderboard" label={t('nav_leaderboard')} icon={Trophy} />
            <NavLink page="profile" label={t('nav_profile')} icon={User} />
            {user?.role === 'admin' && <NavLink page="admin" label="Admin" icon={Shield} />}
        </div>

        <div className="hidden md:flex items-center space-x-4">
            <button onClick={() => setLanguage(language === 'en' ? 'ms' : 'en')} className="p-2 text-slate-400 hover:text-white transition-colors rounded-full hover:bg-white/10 uppercase font-bold text-xs">
                {language}
            </button>
            {user && (
                <button onClick={onLogout} className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-full border border-red-500/20 transition-colors" title={t('nav_logout')}>
                    <LogOut size={18} />
                </button>
            )}
        </div>
        
        {/* Mobile Toggle */}
        <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>{isOpen ? <X /> : <Menu />}</button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="absolute top-16 left-0 w-full bg-slate-900 border-b border-slate-800 p-4 md:hidden flex flex-col space-y-4 shadow-xl z-40 animate-in slide-in-from-top-5">
            <NavLink page="home" label={t('nav_home')} />
            <NavLink page="products" label={t('nav_products')} />
            <NavLink page="game" label={t('nav_game')} />
            <NavLink page="leaderboard" label={t('nav_leaderboard')} />
            <NavLink page="profile" label={t('nav_profile')} />
            <div className="h-px bg-slate-800 my-2"></div>
            <button onClick={onLogout} className="text-red-400 text-sm font-bold flex items-center gap-2"><LogOut size={14}/> {t('nav_logout')}</button>
        </div>
      )}
    </nav>
  );
};

const LoginPage = ({ setUser }: { setUser: any }) => {
    const { t, language, setLanguage } = useTranslation();
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            // Admin Check
            if (isLogin && name === 'admin' && password === 'admin123') {
                if (!auth.currentUser) await signInAnonymously(auth);
                const adminUser = { uid: 'admin-uid', displayName: 'Admin', role: 'admin', email: 'admin@jidobudi.com', photoURL: `https://api.dicebear.com/7.x/avataaars/svg?seed=Admin` };
                setUser(adminUser);
                return;
            }

            if (!auth.currentUser) await signInAnonymously(auth);

            const accountId = btoa(name.toLowerCase().trim());
            const accountRef = doc(db, 'artifacts', appId, 'public', 'data', 'accounts', accountId);

            if (isLogin) {
                const accountSnap = await getDoc(accountRef);
                if (!accountSnap.exists()) throw new Error(t('error_user_not_found'));
                const accountData = accountSnap.data();
                const hashedPassword = await hashPassword(password);
                if (accountData.password !== hashedPassword) throw new Error(t('error_wrong_password'));
                
                if (auth.currentUser) {
                    await updateProfile(auth.currentUser, { displayName: accountData.name, photoURL: `https://api.dicebear.com/7.x/avataaars/svg?seed=${accountData.name}` });
                    await setDoc(doc(db, 'artifacts', appId, 'users', auth.currentUser.uid), { name: accountData.name, email: accountData.email || '', role: 'user', lastLogin: new Date() }, { merge: true });
                    setUser({ ...auth.currentUser, displayName: accountData.name, email: accountData.email, role: 'user' });
                }
            } else {
                const accountSnap = await getDoc(accountRef);
                if (accountSnap.exists()) throw new Error("User exists");
                const hashedPassword = await hashPassword(password);
                await setDoc(accountRef, { name: name, email: email || '', password: hashedPassword, createdAt: new Date() });
                if (auth.currentUser) {
                    await updateProfile(auth.currentUser, { displayName: name, photoURL: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}` });
                    await setDoc(doc(db, 'artifacts', appId, 'users', auth.currentUser.uid), { name: name, email: email || '', role: 'user', joinedAt: new Date(), lastLogin: new Date() }, { merge: true });
                    setUser({ ...auth.currentUser, displayName: name, email: email || '', role: 'user' });
                }
            }
        } catch (err: any) { 
            console.error(err); 
            setError(err.message || "Auth failed"); 
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0f0c29] flex flex-col items-center justify-center p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] z-0"></div>
            <div className="relative z-10 w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="inline-block bg-white/5 p-4 rounded-3xl backdrop-blur-sm mb-4"><JidoBudiLogo /></div>
                    <h1 className="text-3xl font-black text-white mb-2">{t('login_welcome')}</h1>
                </div>
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden p-6">
                     <div className="p-1 bg-slate-100 mb-6 rounded-xl flex">
                        <button onClick={() => setIsLogin(true)} className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${isLogin ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}>{t('login_btn')}</button>
                        <button onClick={() => setIsLogin(false)} className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${!isLogin ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}>{t('signup_btn')}</button>
                     </div>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase ml-1">{t('enter_username')}</label>
                            <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl" />
                        </div>
                        {!isLogin && (
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 uppercase ml-1">{t('enter_email')}</label>
                                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl" />
                            </div>
                        )}
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase ml-1">{t('enter_password')}</label>
                            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl" />
                        </div>
                        {error && <p className="text-red-500 text-xs text-center font-bold">{error}</p>}
                        <button type="submit" disabled={loading} className="w-full py-4 mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg hover:scale-[1.02] transition-all">
                            {loading ? t('processing') : (isLogin ? t('login_btn') : t('signup_btn'))}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

// --- PAGES ---

const HeroPage = ({ onPlay }: { onPlay: () => void }) => {
    const { t } = useTranslation();
    return (
        <section className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden bg-[#0f0c29] text-white pt-24">
             <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] z-0"></div>
             <div className="relative z-10 max-w-7xl mx-auto flex flex-col md:flex-row items-center">
                 <div className="w-full md:w-1/2 text-center md:text-left mb-12 md:mb-0">
                     <span className="text-yellow-400 font-bold tracking-widest text-sm uppercase mb-2 block animate-pulse">Jido Budi Games</span>
                     <h1 className="text-5xl md:text-7xl font-black leading-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-slate-400">{DEFAULT_HOME_CONFIG.title}</h1>
                     <p className="text-slate-400 text-lg mb-8 max-w-md mx-auto md:mx-0 leading-relaxed">{DEFAULT_HOME_CONFIG.subtitle}</p>
                     <button onClick={onPlay} className="px-8 py-4 bg-transparent border-2 border-cyan-400 text-cyan-300 font-bold rounded-full shadow-[0_0_20px_rgba(34,211,238,0.4)] hover:bg-cyan-400 hover:text-slate-900 transition-all duration-300 flex items-center gap-2 mx-auto md:mx-0">
                         {t('play_now')} <ChevronRight />
                     </button>
                 </div>
                 <div className="w-full md:w-1/2 flex justify-center relative">
                     <div className="relative w-72 h-[450px] bg-gradient-to-b from-purple-200 to-indigo-300 rounded-[2.5rem] p-4 shadow-2xl border-r-8 border-b-8 border-indigo-900 transform rotate-y-12 hover:scale-105 transition-transform duration-500">
                        <img src={DEFAULT_HOME_CONFIG.mediaUrl} alt="Vending Machine" className="w-full h-3/5 object-cover rounded-xl opacity-80 border-4 border-white/40" />
                        <div className="mt-4 bg-white/20 rounded-xl p-3 h-1/3"></div>
                     </div>
                 </div>
             </div>
        </section>
    );
}

const ProfilePage = ({ user }: { user: AppUser }) => {
    const { t } = useTranslation();
    const [vouchers, setVouchers] = useState<any[]>([]);

    useEffect(() => {
        if(user?.uid) {
            onSnapshot(query(collection(db, 'artifacts', appId, 'users', user.uid, 'vouchers')), (s) => {
                setVouchers(s.docs.map(d => ({id: d.id, ...d.data()})));
            });
        }
    }, [user]);

    return (
        <div className="pt-24 px-6 max-w-4xl mx-auto min-h-screen">
            <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden border border-slate-100 mb-8">
                <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600"></div>
                <div className="px-8 pb-8 text-center">
                    <div className="-mt-16 mb-4 inline-block p-2 bg-white rounded-full">
                        <img src={user.photoURL || ''} className="w-32 h-32 rounded-full bg-slate-200" alt="Profile" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800">{user.displayName}</h2>
                    <p className="text-slate-500">{user.email}</p>
                </div>
            </div>
            <div className="bg-white rounded-[2rem] shadow-xl p-8 border border-slate-100">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><Trophy className="text-yellow-500"/> {t('my_vouchers')}</h3>
                <div className="grid gap-4 md:grid-cols-2">
                    {vouchers.map(v => (
                        <div key={v.id} className="border border-slate-200 rounded-xl p-4 flex flex-col items-center text-center bg-slate-50">
                            <span className="text-2xl font-mono font-black text-slate-800">{v.code}</span>
                            <span className="text-sm text-slate-500">Score: {v.score}</span>
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full mt-2">{v.status}</span>
                        </div>
                    ))}
                    {vouchers.length === 0 && <p className="text-slate-400">{t('no_vouchers')}</p>}
                </div>
            </div>
        </div>
    )
}

function MainContent() {
  const [user, setUser] = useState<AppUser | null>(null);
  const [currentPage, setCurrentPage] = useState('home'); 
  const [activeGameMode, setActiveGameMode] = useState<'match3' | 'swipe' | null>(null); 
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u: any) => { 
        if (u) setUser({ ...u, role: u.displayName === 'Admin' ? 'admin' : 'user' });
        else setUser(null);
        setAuthLoading(false); 
    });
    return () => unsub();
  }, []);

  if (authLoading) return <div className="min-h-screen bg-[#0f0c29] flex items-center justify-center text-white">Loading...</div>;
  if (!user) return <LanguageProvider><LoginPage setUser={setUser} /></LanguageProvider>;

  return (
    <LanguageProvider>
        <div className="font-sans antialiased bg-slate-50 min-h-screen flex flex-col">
            <Navbar user={user} onLogout={() => signOut(auth)} activePage={currentPage} setActivePage={(p: string) => { setCurrentPage(p); setActiveGameMode(null); }} />
            
            <main className="flex-grow">
                {currentPage === 'home' && <HeroPage onPlay={() => setCurrentPage('game')} />}
                {currentPage === 'game' && (
                    <div className="pt-24 pb-20 bg-indigo-50 min-h-screen flex flex-col items-center">
                        {!activeGameMode ? (
                            <GameSelection onSelect={setActiveGameMode} />
                        ) : (
                            activeGameMode === 'match3' ? 
                                <Match3Game user={user} onOpenAuth={() => {}} onBack={() => setActiveGameMode(null)} /> : 
                                <SnackSwipeGame user={user} onOpenAuth={() => {}} onBack={() => setActiveGameMode(null)} />
                        )}
                    </div>
                )}
                {currentPage === 'profile' && <ProfilePage user={user} />}
                {/* Placeholder for other pages to keep file small */}
                {(currentPage === 'products' || currentPage === 'leaderboard' || currentPage === 'about') && (
                    <div className="pt-32 text-center text-slate-500">
                        <h2 className="text-2xl font-bold">{currentPage.toUpperCase()}</h2>
                        <p>Content coming soon...</p>
                    </div>
                )}
            </main>
            <ChatBot />
        </div>
    </LanguageProvider>
  );
}

export default MainContent;