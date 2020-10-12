import * as React from "react";

export interface Props {
  title: React.HTMLProps<HTMLHeadingElement>;
  optimizeTargetButton: React.ButtonHTMLAttributes<HTMLButtonElement>;
}

export const Component: React.FC<Props> = ({ title, optimizeTargetButton: hogeButton }) => {
  return (
    <div>
      <h1 {...title} />
      <p>
        <button type="button" {...hogeButton} />
      </p>
    </div>
  );
};

Component.displayName = "Target";
