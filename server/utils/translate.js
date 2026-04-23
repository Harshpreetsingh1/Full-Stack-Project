const axios = require('axios');

const MYMEMORY_API = 'https://api.mymemory.translated.net/get';
const isHindi = (text) => {
  const devanagariRegex = /[\u0900-\u097F]/;
  return devanagariRegex.test(text);
};
const translateText = async (text) => {
  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    return '';
  }
  try {
    const langPair = isHindi(text) ? 'hi|en' : 'en|hi';

    const response = await axios.get(MYMEMORY_API, {
      params: {
        q: text.substring(0, 500),
        langpair: langPair,
      },
      timeout: 10000,
    });
    if (
      response.data &&
      response.data.responseData &&
      response.data.responseData.translatedText
    ) {
      return response.data.responseData.translatedText;
    }
    return '';
  } catch (error) {
    console.error('Translation API error:', error.message);
    return '';
  }
};
module.exports = { translateText, isHindi };
