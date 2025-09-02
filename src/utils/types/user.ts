export interface User {
  id: string | undefined;
  language: 'nl' | 'en';
  colorScheme: 'light' | 'dark';
  handedness?: 'left' | 'right' | 'ambidextrous';
}
