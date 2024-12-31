import { DevContact } from "@/components/custom/dev-contact";
import useSession from "@/hooks/session.hook";
import { Box, Icon, Link, Stack, Text } from "@chakra-ui/react";
import { LuLinkedin, LuMail, LuPhone } from "react-icons/lu";
import { Navigate, Outlet } from "react-router";

export type LayoutProps = {
  children?: React.ReactNode;
};

export const SessionLayout: React.FC<LayoutProps> = () => {
  const { isLoggedIn } = useSession();
  if (isLoggedIn) return <Navigate to="/" />;
  return (
    <Stack alignItems="center" justify="center" minHeight="100vh">
      <DevContact />
      <Outlet />
    </Stack>
  );
};
