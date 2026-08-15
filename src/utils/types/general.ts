import { ButtonType, ColorVariant, Size } from "./enums";

export interface ConfirmPopUpProps {
  title: string;
  section: string;
  cancel: string;
  confirm: string;
}

export interface PillProps {
  variant?: ColorVariant;
  size?: Size;
}

export interface SwitchProps {
  textLeft: string;
  textRight: string;
  variant?: ColorVariant;
  size?: Size;
}
