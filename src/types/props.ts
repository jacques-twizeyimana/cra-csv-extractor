import { FormEvent } from "react";

export type IconNames =
  | "close"
  | "upload"
  | "table"
  | "process"
  | "chevron-down"
  | "triangle";

export type Color =
  | "primary-400"
  | "primary-500"
  | "primary-600"
  | "neutral-250"
  | "neutral-350"
  | "neutral-400"
  | "neutral-500"
  | "neutral-600"
  | "error-500";

export interface IData {
  [key: string]: string | number | boolean;
}

export interface SelectData {
  value: string | number;
  label: string;
  subLabel?: string;
}

export interface ValueType<T = Event> {
  name: string;
  value: string | number | boolean | string[];
  label?: string;
  event?: FormEvent<T>;
}

export interface commonInputProps {
  required?: boolean;
  handleChange: (_e: ValueType) => any;
  name: string;
  options: SelectData[];
  className?: string;
  placeholder?: string;
  disabled?: boolean;
}

export interface SelectProps extends commonInputProps {
  loading?: boolean;
  value?: string;
  hasError?: boolean;
  width?: string;
}

export interface MultiselectProps extends commonInputProps {
  loading?: boolean;
  value?: string[];
  hasError?: boolean;
  width?: string;
}
