
import { ReactNode } from 'react';

export enum ButtonVariants {
  DEFAULT = 'default',
  DESTRUCTIVE = 'destructive',
  OUTLINE = 'outline',
  SECONDARY = 'secondary',
  GHOST = 'ghost',
  LINK = 'link',
  SUCCESS = 'success',
  WARNING = 'warning',
}

export enum BadgeVariants {
  DEFAULT = 'default',
  SECONDARY = 'secondary',
  DESTRUCTIVE = 'destructive',
  OUTLINE = 'outline',
  SUCCESS = 'success',
  WARNING = 'warning',
  INFO = 'info',
  CITIZENSHIP = 'citizenship',
}

export enum AlertVariants {
  DEFAULT = 'default',
  DESTRUCTIVE = 'destructive',
  SUCCESS = 'success',
  WARNING = 'warning',
  OUTLINE = 'outline',
  SECONDARY = 'secondary',
  INFO = 'info',
}

export enum ButtonSizes {
  DEFAULT = 'default',
  SM = 'sm',
  LG = 'lg',
  ICON = 'icon',
  XS = 'xs',
}

export type ExtendedAlertVariant = AlertVariants | 'info' | 'citizenship';

export type NotificationBellProps = {
  count?: number;
  onClick?: () => void;
  className?: string;
};

export type BarChartProps = {
  data: any[];
  xField: string;
  yField: string;
  height?: number;
  xAxisLabel?: string;
  yAxisLabel?: string;
  tooltip?: boolean;
  grid?: boolean;
  colors?: string[];
  onClick?: (data: any) => void;
};
