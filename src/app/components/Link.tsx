import type { Path } from "../shared/links";
import { link } from "../shared/links";

type LinkProps = {
  children: React.ReactNode;
  href: Path;
} & React.AnchorHTMLAttributes<HTMLAnchorElement>;

export function Link({ children, href, ...props }: LinkProps) {
  return (
    <a href={link(href)} {...props}>
      {children}
    </a>
  );
}
