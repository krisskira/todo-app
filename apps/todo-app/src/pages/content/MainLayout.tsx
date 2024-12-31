import useSession from "@/hooks/session.hook";
import { Navigate, Outlet, redirect } from "react-router";
import { Button } from "../../components/ui/button";
import { Box, Grid, GridItem, Spacer } from "@chakra-ui/react";
import { useAppSelector } from "@/core/redux/hooks";
import {
  UserInfoVertical,
  UserInfoHorizontal,
} from "@/components/custom/user-info";
import { User } from "todo-types";
import { DevContact } from "@/components/custom/dev-contact";

export type MainLayoutProps = {
  children?: React.ReactNode;
};

const UserEmpty: User = {
  uuid: "",
  firstName: "",
  lastName: "",
  email: "",
};

export const MainLayout: React.FC<MainLayoutProps> = () => {
  const { isLoggedIn } = useAppSelector((state) => state.session);
  const { logout, user: { data: USER = UserEmpty } = {} } = useSession();

  if (!isLoggedIn) return <Navigate to={"/session/login"} />;

  const closeSession = () => {
    redirect("/session/login");
    logout();
  };

  return (
    <Grid
      h="100vh"
      boxSizing="border-box"
      gap={4}
      padding={4}
      templateAreas={{
        base: `"content"`,
        md: `"left content"`,
      }}
      templateColumns={{
        base: `"1fr"`,
        md: "200px 1fr",
      }}
    >
      {/* Left Side */}

      <GridItem
        area="left"
        justifyContent={"center"}
        padding={4}
        display={{ base: "none", md: "flex" }}
      >
        <Box h="100%" gap={4} boxSizing="border-box">
          <UserInfoVertical user={USER} />
          <Button
            mt={4}
            look="normal"
            variant="outline"
            w="full"
            onClick={closeSession}
          >
            Cerrar sesión
          </Button>
          <Spacer />
          <Box mt={8}>
            <DevContact />
          </Box>
        </Box>
      </GridItem>

      {/* Content Side */}
      <GridItem area="content">
        <Box display={{ base: "grid", md: "none" }}>
          <UserInfoHorizontal user={USER} onClose={closeSession} />
        </Box>
        <Box mt={4} boxSizing="border-box">
          <Outlet />
        </Box>
      </GridItem>
    </Grid>
  );
};
