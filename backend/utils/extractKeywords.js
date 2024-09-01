import natural from "natural";
import sw from "stopword";

const tokenizer = new natural.WordTokenizer();

export function extractKeywords(text) {
  // Tokenize the text into words
  const words = tokenizer.tokenize(text);

  // Remove stopwords from the tokenized words
  const filteredWords = sw.removeStopwords(words);
  const correctfilterwords = filteredWords.filter((word) => word.length > 2);

  const keywordFreq = {};

  // Calculate frequency of each word
  correctfilterwords.forEach((word) => {
    const lowerWord = word.toLowerCase();
    if (keywordFreq[lowerWord]) {
      keywordFreq[lowerWord]++;
    } else {
      keywordFreq[lowerWord] = 1;
    }
  });

  // Sort keywords by frequency and return them
  const sortedKeywords = Object.keys(keywordFreq).sort(
    (a, b) => keywordFreq[b] - keywordFreq[a]
  );
  return sortedKeywords; // Return sorted keywords
}
