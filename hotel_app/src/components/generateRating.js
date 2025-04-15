// generateRating.js
export const generateRating = (id) => {
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }
    // Use modulus to get a number between 0 and 50, then divide by 10 for a rating between 0 and 5.
    let rating = (Math.abs(hash) % 50) / 10;
    if (rating < 1) rating = 1; // Ensure a minimum rating of 1
    return rating.toFixed(1);
  };
  