import * as React from "react";
import { cn } from "../../lib/utils";

const Marquee = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    reverse?: boolean;
    pauseOnHover?: boolean;
  }
>(({ className, reverse, pauseOnHover = false, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex overflow-hidden [--duration:40s] [--gap:1rem]",
      className
    )}
    {...props}
  >
    <div
      className={cn(
        "flex min-w-full shrink-0 gap-[--gap]",
        reverse && "animate-marquee-reverse",
        !reverse && "animate-marquee",
        pauseOnHover && "hover:[animation-play-state:paused]"
      )}
    >
      {props.children}
    </div>
    <div
      className={cn(
        "flex min-w-full shrink-0 gap-[--gap]",
        reverse && "animate-marquee-reverse",
        !reverse && "animate-marquee",
        pauseOnHover && "hover:[animation-play-state:paused]"
      )}
    >
      {props.children}
    </div>
  </div>
));
Marquee.displayName = "Marquee";

export { Marquee };
