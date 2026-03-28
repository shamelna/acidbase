// Utility functions for acid-base diagnosis

export const getValueStatus = (value, min, max) => {
  if (value === '') return 'empty';
  const numValue = parseFloat(value);
  if (isNaN(numValue)) return 'invalid';
  
  if (numValue < min) return 'low';
  if (numValue > max) return 'high';
  return 'normal';
};

export const getProgressPercentage = (value, min, max) => {
  if (value === '') return 0;
  const numValue = parseFloat(value);
  if (isNaN(numValue)) return 0;
  
  const range = max - min;
  const position = numValue - min;
  return Math.max(0, Math.min(100, (position / range) * 100));
};

export const getPhIndicatorPosition = (pH) => {
  if (pH === '') return 50;
  const numValue = parseFloat(pH);
  if (isNaN(numValue)) return 50;
  
  // Map pH 6.8-8.0 to percentage 0-100
  const range = 8.0 - 6.8;
  const position = numValue - 6.8;
  return Math.max(0, Math.min(100, (position / range) * 100));
};

export const getDiagnosisClassification = (diagnosis) => {
  if (diagnosis.includes('Normal')) return 'normal';
  if (diagnosis.includes('Pathological')) return 'pathological';
  return 'abnormal';
};

export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy text: ', err);
    return false;
  }
};
