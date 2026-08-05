import { LucideIcon, LucideProps } from "lucide-react";

export interface IconProps extends LucideProps {
  icon: LucideIcon;
}

export function Icon({ icon: IconComponent, ...props }: IconProps) {
  return <IconComponent {...props} />;
}
