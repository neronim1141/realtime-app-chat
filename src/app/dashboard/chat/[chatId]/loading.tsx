import { FC } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
interface LoadingProps {}

const Loading: FC<LoadingProps> = ({}) => {
  return (
    <div className="flex flex-col h-full items-center">
      <Skeleton className="mb-4" height={40} width={400} />
      {/* chat messages */}
    </div>
  );
};

export default Loading;
