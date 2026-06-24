// Basit i18n sözlüğü. Her giriş { tr, en }.
// Kullanım: const { t } = useLanguage(); t(translations.common.signIn)

export type Translation = { tr: string; en: string };

export const translations = {
  common: {
    appName: { tr: "Labyra Araçlar", en: "Labyra Tools" },
    signIn: { tr: "Giriş yap", en: "Sign in" },
    signUp: { tr: "Hesap aç", en: "Sign up" },
    signOut: { tr: "Çıkış", en: "Sign out" },
    email: { tr: "E-posta", en: "Email" },
    password: { tr: "Şifre", en: "Password" },
    fullName: { tr: "Ad Soyad", en: "Full name" },
    continue: { tr: "Devam et", en: "Continue" },
    cancel: { tr: "Vazgeç", en: "Cancel" },
    loading: { tr: "Yükleniyor…", en: "Loading…" },
    free: { tr: "Ücretsiz", en: "Free" },
    account: { tr: "Hesabım", en: "My account" },
    dashboard: { tr: "Araçlar", en: "Tools" },
    downloadPdf: { tr: "PDF indir", en: "Download PDF" },
    requiresAccount: {
      tr: "Kullanmak için ücretsiz hesap gerekir",
      en: "A free account is required to use this",
    },
  },
  auth: {
    signInTitle: { tr: "Tekrar hoş geldin", en: "Welcome back" },
    signUpTitle: { tr: "Ücretsiz hesabını aç", en: "Create your free account" },
    googleContinue: { tr: "Google ile devam et", en: "Continue with Google" },
    orEmail: { tr: "veya e-posta ile", en: "or with email" },
    noAccount: { tr: "Hesabın yok mu?", en: "No account?" },
    haveAccount: { tr: "Zaten hesabın var mı?", en: "Already have an account?" },
    forgotPassword: { tr: "Şifremi unuttum", en: "Forgot password" },
  },
  tools: {
    salary: { tr: "Brüt-net maaş hesaplama", en: "Gross-net salary calculator" },
    finance: { tr: "KDV ve faiz hesaplayıcı", en: "VAT & interest calculator" },
    exam: { tr: "Deneme net & puan", en: "Mock exam net & score" },
    label: { tr: "CSV'den etiket PDF", en: "CSV to label PDF" },
    qrMenu: { tr: "QR menü oluşturucu", en: "QR menu builder" },
  },
  cookie: {
    message: {
      tr: "Deneyimini iyileştirmek ve kullanımı ölçmek için çerez kullanıyoruz.",
      en: "We use cookies to improve your experience and measure usage.",
    },
    accept: { tr: "Kabul et", en: "Accept" },
    decline: { tr: "Reddet", en: "Decline" },
  },
  toolCard: {
    soon: { tr: "Yakında", en: "Soon" },
    use: { tr: "Kullan →", en: "Use →" },
  },
  notFound: {
    title: { tr: "Sayfa bulunamadı", en: "Page not found" },
    desc: {
      tr: "Aradığın sayfa taşınmış ya da hiç var olmamış olabilir.",
      en: "The page you are looking for may have moved or never existed.",
    },
    back: { tr: "Araçlara dön", en: "Back to tools" },
  },
  panel: {
    title: { tr: "Araçların", en: "Your tools" },
    subtitle: {
      tr: "Bir araç seç ve kullanmaya başla.",
      en: "Pick a tool and get started.",
    },
    produced: { tr: "Ürettiklerin", en: "What you've made" },
    viewMenu: { tr: "Menüyü gör →", en: "View menu →" },
    edit: { tr: "Düzenle", en: "Edit" },
    used: { tr: "kullanıldı", en: "used" },
    emptyTitle: { tr: "Henüz bir şey üretmedin", en: "Nothing here yet" },
    emptyDesc: {
      tr: "Aşağıdaki araçlardan birini seçerek başla.",
      en: "Get started by picking one of the tools below.",
    },
  },
  authErrors: {
    invalidCredentials: {
      tr: "E-posta veya şifre hatalı.",
      en: "Invalid email or password.",
    },
    weakPassword: {
      tr: "Şifre en az 6 karakter olmalı.",
      en: "Password must be at least 6 characters.",
    },
  },
  authMessages: {
    confirmEmail: {
      tr: "Hesabını onaylamak için e-postana gönderdiğimiz bağlantıya tıkla.",
      en: "Click the link we sent to your email to confirm your account.",
    },
  },
  a11y: {
    changeLang: { tr: "Dili değiştir", en: "Change language" },
    lightTheme: { tr: "Açık temaya geç", en: "Switch to light theme" },
    darkTheme: { tr: "Koyu temaya geç", en: "Switch to dark theme" },
    openMenu: { tr: "Menüyü aç", en: "Open menu" },
    closeMenu: { tr: "Menüyü kapat", en: "Close menu" },
  },
  home: {
    heroTitle: {
      tr: "İşletmen için ücretsiz araçlar",
      en: "Free tools for your business",
    },
    heroSubtitle: {
      tr: "Etiket PDF, maaş ve KDV hesaplayıcı, QR menü ve daha fazlası. Ücretsiz hesap aç, hemen kullanmaya başla.",
      en: "Label PDF, salary and VAT calculators, a QR menu and more. Create a free account and start right away.",
    },
    ctaStart: { tr: "Ücretsiz başla", en: "Get started free" },
  },
} as const;
