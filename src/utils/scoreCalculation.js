export const calculateWeightedAverageScore = (examResults) => {
  if (!examResults || examResults.length === 0) return 0;

  const categoryWeights = {
    'verbal': 0.35,
    'analytical': 0.30, 
    'numerical': 0.30,
    'general': 0.05
  };

  const categoryScores = {};
  const categoryCounts = {};

  examResults.forEach(result => {
    const category = result.category?.toLowerCase() || 'general';

    if (!categoryScores[category]) {
      categoryScores[category] = 0;
      categoryCounts[category] = 0;
    }

    categoryScores[category] += result.score || 0;
    categoryCounts[category]++;
  });

  const categoryAverages = {};
  Object.keys(categoryScores).forEach(category => {
    categoryAverages[category] = categoryScores[category] / categoryCounts[category];
  });

  let weightedSum = 0;

  Object.keys(categoryWeights).forEach(category => {
    if (categoryAverages[category] !== undefined) {
      weightedSum += categoryAverages[category] * categoryWeights[category];
    }
  });

  return Math.round(weightedSum);
};