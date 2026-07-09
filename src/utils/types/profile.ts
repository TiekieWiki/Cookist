import { ColorScheme, Handedness, Language } from './enums';

export interface Profile {
  id: string | undefined;
  language: Language;
  colorscheme: ColorScheme;
  handedness: Handedness;
}
