import { forwardRef } from "react";
import {
  useRouter,
  useLocation as useTanstackLocation,
  useParams as useTanstackParams,
} from "@tanstack/react-router";

/**
 * Small compatibility layer so the site's page components can keep using the
 * familiar `Link` / `NavLink` / `useNavigate` API on top of TanStack Router.
 */

export function useLocation() {
  return useTanstackLocation();
}

export function useParams() {
  return useTanstackParams({ strict: false });
}

export function useNavigate() {
  const router = useRouter();
  return (to, options) => {
    if (typeof to === "number") {
      window.history.go(to);
      return;
    }
    if (options?.replace) {
      router.history.replace(to);
    } else {
      router.history.push(to);
    }
  };
}

function isModifiedEvent(event) {
  return event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
}

export const Link = forwardRef(function Link(
  { to, replace, className, style, children, onClick, ...rest },
  ref,
) {
  const router = useRouter();
  const location = useTanstackLocation();
  const isActive =
    location.pathname === to ||
    (to !== "/" && location.pathname.startsWith(`${to}/`));

  const resolvedClassName =
    typeof className === "function" ? className({ isActive }) : className;
  const resolvedStyle = typeof style === "function" ? style({ isActive }) : style;

  return (
    <a
      ref={ref}
      href={to}
      className={resolvedClassName}
      style={resolvedStyle}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        if (event.button !== 0 || isModifiedEvent(event)) return;
        event.preventDefault();
        if (replace) {
          router.history.replace(to);
        } else {
          router.history.push(to);
        }
      }}
      {...rest}
    >
      {typeof children === "function" ? children({ isActive }) : children}
    </a>
  );
});

export const NavLink = Link;
