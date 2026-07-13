import { logoutAction } from "@/server/actions/auth-actions";
import { Button, type ButtonProps } from "@/shared/components/Button";

export function LogoutButton(props: ButtonProps) {
  return (
    <form action={logoutAction}>
      <Button type="submit" {...props}>
        خروج
      </Button>
    </form>
  );
}
