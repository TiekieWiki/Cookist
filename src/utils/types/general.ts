import { ColorVariant, Size } from './enums';
import { type ActionError } from '../global/errorHandling';

export interface MenuItem {
  route: string;
  name: string;
  condition?: boolean;
}

export interface ConfirmPopUpProps {
  title: string;
  section: string;
  cancel: string;
  confirm: string;
  loading?: boolean;
  error?: ActionError | null;
}

export interface EmptyStateProps {
  icon: string;
  title: string;
  subtitle: string;
  buttonText: string;
  buttonIcon?: string;
  buttonRoute: string;
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
