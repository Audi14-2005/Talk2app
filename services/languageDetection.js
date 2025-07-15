// utils/languageUtils.js
export const supportedLanguages = [
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी' },
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
];

// Simple language detection based on Unicode ranges
export const detectLanguage = async (text) => {
  if (!text.trim()) {
    return { language: 'en', confidence: 0, languageName: 'English' };
  }

  await new Promise(resolve => setTimeout(resolve, 300)); // simulate delay

  const patterns = {
    hi: /[\u0900-\u097F]/,  // Devanagari
    ta: /[\u0B80-\u0BFF]/,  // Tamil
    te: /[\u0C00-\u0C7F]/,  // Telugu
    bn: /[\u0980-\u09FF]/,  // Bengali
    mr: /[\u0900-\u097F]/,  // Marathi (Devanagari)
    gu: /[\u0A80-\u0AFF]/,  // Gujarati
    kn: /[\u0C80-\u0CFF]/,  // Kannada
    ml: /[\u0D00-\u0D7F]/,  // Malayalam
    pa: /[\u0A00-\u0A7F]/,  // Punjabi
  };

  let detectedLang = 'en';
  let confidence = 0.5;

  for (const [lang, pattern] of Object.entries(patterns)) {
    const matches = text.match(pattern);
    if (matches) {
      detectedLang = lang;
      confidence = Math.min(0.95, 0.7 + (matches.length / text.length) * 0.25);
      break;
    }
  }

  const languageInfo = supportedLanguages.find(l => l.code === detectedLang);
  
  return {
    language: detectedLang,
    confidence,
    languageName: languageInfo?.name || 'English'
  };
};

export const translateText = async (text, fromLang, toLang = 'en') => {
  await new Promise(resolve => setTimeout(resolve, 500)); // simulate delay

  const mockTranslations = {
    'मैं एक नया उत्पाद जोड़ना चाहता हूं': 'I want to add a new product',
    'चावल की किस्म बासमती': 'basmati rice variety',
    'सूती साड़ी': 'cotton saree',
    'हल्दी पाउडर': 'turmeric powder',
    'जैविक': 'organic'
  };

  return mockTranslations[text] || `Translated: ${text}`;
};
