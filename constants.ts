export const DEFAULT_GAME_CONFIG = {
  winScore: 1000,
  timeLimit: 60,
  voucherProbability: 100,
  theme: 'default'
};

export const DEFAULT_HOME_CONFIG = {
  title: "Snack Match & Arcade",
  subtitle: "Choose your game, earn high scores, and win real vouchers from our virtual vending machine!",
  mediaType: "image",
  mediaUrl: "https://images.unsplash.com/photo-1625699414476-47b1b369527d?auto=format&fit=crop&w=800&q=80"
};

export const THEME_SETS: Record<string, string[]> = {
  default: ['🥔', '🍫', '🥤', '🍬', '🍪', '🧃'],
  fruits: ['🍎', '🍌', '🍇', '🍊', '🍓', '🍉'],
  sports: ['⚽', '🏀', '🏈', '⚾', '🎾', '🏐'],
  animals: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊']
};

export const TRANSLATIONS: Record<string, any> = {
  en: {
    nav_home: "Home", nav_products: "Products", nav_game: "Game", nav_leaderboard: "Leaderboard",
    nav_about: "About", nav_profile: "Profile", nav_login: "Login", nav_signup: "Sign Up", nav_logout: "Logout",
    nav_admin: "Admin Console", play_now: "Play Now", score: "Score", timer: "Timer", start_game: "Start Game",
    score_win: "Score to Win!", login_btn: "Login", signup_btn: "Sign Up",
    login_welcome: "Welcome to Jido Budi", login_subtitle: "Your gateway to fun games and tasty rewards!",
    enter_username: "Username", enter_email: "Email", enter_password: "Password", processing: "Processing...",
    you_won: "YOU WON!", you_scored: "You scored", times_up: "Time's Up!", play_again: "Play Again",
    choose_game: "Choose Your Game", game_match: "Snack Match", game_swipe: "Snack Swipe",
    top_snackers: "Top Snackers", about_title: "About Jido Budi",
    about_desc: "Revolutionizing snacking.", mission_title: "Our Mission", mission_desc: "To bring joy to every snack break.",
    visit_us: "Visit Us", footer_rights: "All rights reserved", mobile_friendly: "Mobile-friendly experience.",
    hello: "Hello", sent_to: "Added to Wallet:", login_claim: "Login to claim", sending: "Generating...", email_voucher: "Save Voucher",
    retry: "Retry", resend: "Save", voucher_code: "Code", chat_header: "Chat with Jido", chat_placeholder: "Ask Jido...",
    chat_intro: "Hello! I'm Jido Budi! 🤖🍫", restocked: "Restocked Daily", whats_inside: "What's Inside?",
    grab_snacks: "Grab your favorite snacks.", select: "Select", member_since: "Member Since", last_login: "Last Login",
    account_type: "Account Type", loading_data: "Loading...", my_vouchers: "Voucher Wallet", no_vouchers: "No vouchers yet. Play games to win!",
    voucher_won: "Won on", game_played: "Game", loading_leaderboard: "Loading...", no_scores: "No scores yet.",
    redeem_code: "Enter Promo Code", redeem_btn: "Redeem", invalid_code: "Invalid or expired code", code_success: "Code redeemed!", code_copied: "Code Copied!",
    featured_product: "Featured Product", profile_title: "My Profile", profile_desc: "Manage your account and view your rewards."
  },
  ms: {
    nav_home: "Utama", nav_products: "Produk", nav_game: "Permainan", nav_leaderboard: "Papan Pendahulu",
    nav_about: "Tentang", nav_profile: "Profil", nav_admin: "Konsol", nav_login: "Log Masuk", nav_signup: "Daftar",
    nav_logout: "Log Keluar", play_now: "Main Sekarang",
    login_welcome: "Selamat Datang ke Jido Budi", login_subtitle: "Gerbang anda ke permainan menyeronokkan!",
    login_btn: "Log Masuk", signup_btn: "Daftar", enter_username: "Nama Pengguna", enter_email: "Emel",
    enter_password: "Kata Laluan", processing: "Memproses...",
    score: "Markah", timer: "Masa", start_game: "Mula", score_win: "Dapat 1000 markah untuk menang!",
    you_won: "ANDA MENANG!", you_scored: "Markah anda", times_up: "Masa Tamat!", play_again: "Main Lagi",
    choose_game: "Pilih Permainan", game_match: "Padan Snek", game_swipe: "Leret Snek", top_snackers: "Pemain Terhebat",
    about_title: "Tentang Jido Budi", about_desc: "Merevolusikan pengalaman snek.", mission_title: "Misi Kami", mission_desc: "Membawa kegembiraan dalam setiap rehat snek.",
    visit_us: "Lawati Kami", footer_rights: "Hak cipta terpelihara", mobile_friendly: "Pengalaman mesra mudah alih.",
    hello: "Helo", sent_to: "Disimpan ke Dompet", login_claim: "Log masuk untuk tuntut", sending: "Menjana...",
    email_voucher: "Simpan Baucar", retry: "Cuba Lagi", resend: "Simpan", voucher_code: "Kod",
    chat_header: "Borak dengan Jido", chat_placeholder: "Tanya Jido...",
    chat_intro: "Helo! Saya Jido Budi! 🤖🍫", restocked: "Stok Semula Harian", whats_inside: "Apa di Dalam?",
    grab_snacks: "Dapatkan snek kegemaran anda.", select: "Pilih", member_since: "Ahli Sejak",
    last_login: "Log Masuk Terakhir", account_type: "Jenis Akaun", loading_data: "Memuatkan...", my_vouchers: "Dompet Baucar Saya", no_vouchers: "Belum ada baucar. Main permainan untuk menang!",
    voucher_won: "Dimenangi pada", game_played: "Permainan", loading_leaderboard: "Memuatkan markah...",
    no_scores: "Tiada markah lagi. Jadilah yang pertama!", code_copied: "Kod Disalin!", redeem_code: "Masukkan Kod Promo", redeem_btn: "Tuntut", profile_title: "Profil Saya", profile_desc: "Urus akaun dan lihat ganjaran anda."
  }
};