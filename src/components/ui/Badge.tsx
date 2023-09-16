import { FC, PropsWithChildren } from "react";

interface BadgeProps extends PropsWithChildren {}

const Badge: FC<BadgeProps> = ({ children }) => {
  return (
    <div className="rounded-full w-5 h-5 rext-xs flex justify-center items-center text-white bg-indigo-600">
      {children}
    </div>
  );
};

export default Badge;
