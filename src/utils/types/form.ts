import { AutoCompleteVariant, ButtonSize, ButtonType, ColorVariant } from './enums';

export interface ButtonProps {
  variant?: ColorVariant;
  type: ButtonType;
  filled?: boolean;
  size?: ButtonSize;
  iconOnly?: boolean;
  disabled?: boolean;
}

export interface CheckBoxProps {
  id?: string;
  variant?: ColorVariant;
  name: string;
  label: string | number;
  required?: boolean;
  disabled?: boolean;
  autocomplete?: string;
  checked?: boolean;
}

export interface CheckBoxListProps {
  id?: string;
  label?: string | number;
  required?: boolean;
}

export interface ConfirmPopUpProps {
  title: string;
  section: string;
  cancel: string;
  confirm: string;
}

export interface InputFieldProps {
  id?: string;
  name: string;
  variant?: ColorVariant;
  label?: string | number;
  placeholder?: string;
  ariaLabel: string;
  type: string;
  required?: boolean;
  disabled?: boolean;
  autocomplete?: AutoCompleteVariant;
  min?: number;
  max?: number;
  step?: number;
}

export interface InputListProps {
  id?: string;
  label?: string | number;
  required?: boolean;
  empty?: boolean;
}

export interface SelectFieldProps {
  id?: string;
  variant?: ColorVariant;
  label?: string | number;
  placeholder?: string;
  ariaLabel: string;
  required?: boolean;
  disabled?: boolean;
  items: { value: string; label: string }[];
  labelPrefix?: string;
}

export interface TextAreaProps {
  id?: string;
  variant?: ColorVariant;
  name: string;
  label?: string | number;
  placeholder: string;
  ariaLabel: string;
  required?: boolean;
  disabled?: boolean;
}

export interface ToggleProps {
  variant?: ColorVariant;
}

export interface UploadImageProps {
  id?: string;
  variant?: ColorVariant;
  name: string;
  label?: string | number;
  placeholder?: string;
  ariaLabel: string;
  required?: boolean;
  disabled?: boolean;
  oldImage?: string;
}
