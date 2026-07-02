export interface Profile {
  id: string | undefined;
  language: 'nl' | 'en';
  colorScheme: 'light' | 'dark';
  handedness: 'left' | 'right' | 'ambidextrous';
}
