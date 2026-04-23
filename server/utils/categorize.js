const CATEGORY_KEYWORDS = {
  billing: [
    'bill', 'billing', 'payment', 'refund', 'charge', 'invoice',
    'subscription', 'price', 'cost', 'fee', 'money', 'paid', 'pay',
    'transaction', 'receipt',
  ],
  technical: [
    'error', 'bug', 'issue', 'not working', 'crash', 'slow',
    'broken', 'fail', 'failure', 'glitch', 'freeze', 'hang',
    'loading', 'timeout', 'down', 'unavailable', 'login problem',
  ],
};
const categorize = (text) => {
  if (!text || typeof text !== 'string') return 'general';

  const lowerText = text.toLowerCase();

  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    for (const keyword of keywords) {
      if (lowerText.includes(keyword)) {
        return category;
      }
    }
  }

  return 'general';
};

module.exports = categorize;
