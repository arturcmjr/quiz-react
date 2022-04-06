export const defaultSettings = {
  difficulty: 'easy',
  type: 'multiple',
  category: -1,
  questionsAmount: 10,
  timeLimit: 15,
};

export function loadSettings() {
  if(sessionStorage.getItem('settings')) {
    return JSON.parse(sessionStorage.getItem('settings'));
  } else {
    sessionStorage.setItem('settings', JSON.stringify(defaultSettings));
    return defaultSettings;
  }
}

export function saveSettings(settings) {
  sessionStorage.setItem('settings', JSON.stringify(settings));
}
