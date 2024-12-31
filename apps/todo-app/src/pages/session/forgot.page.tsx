import { SubmitHandler, useForm } from "react-hook-form";
import useSession from "../../hooks/session.hook";
import { Button } from "@/components/ui/button";
import {
  AlertDescription,
  Card,
  Input,
  Spacer,
  Stack,
  useRecipe,
} from "@chakra-ui/react";
import { Field } from "@/components/ui/field";
import { Link } from "react-router";
import { ShadowRecipe } from "@/core/config/theme";
import { ForgotPasswordPostDtoSchema } from "todo-types";

import { Alert } from "@/components/ui/alert";

export type ForgotPageProps = {
  children?: React.ReactNode;
};

export const ForgotPage: React.FC<ForgotPageProps> = () => {
  const { forgotPassword } = useSession();
  const recipe = useRecipe({ recipe: ShadowRecipe });
  const styles = recipe({ look: "aurora" });
  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ForgotPasswordPostDtoSchema>();

  const onSubmit: SubmitHandler<ForgotPasswordPostDtoSchema> = async (data) => {
    await forgotPassword.execute(data.email);
    reset();
  };

  return (
    <Stack gap="4" align="center" maxW="full">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card.Root css={styles} maxW="lg" p="4">
          <Card.Header>
            <Card.Title>Recuperar contraseña</Card.Title>
            <Card.Description>
              Ingresa tu correo electrónico se te enviará información para
              recuperar tu contraseña
            </Card.Description>
          </Card.Header>
          <Card.Body>
            <Stack gap="4" align="flex-start" maxW="full">
              <Field
                label="Correo electrónico"
                invalid={!!errors.email}
                errorText={errors.email?.message}
              >
                <Input
                  required
                  placeholder="john.doe@example.com"
                  {...registerField("email")}
                />
              </Field>
            </Stack>
            <Spacer />
            {forgotPassword?.data?.message === "password_reset" && (
              <Alert status="success" mt={4} title="¡Recuperación exitosa!">
                <AlertDescription>
                  Te has enviado un correo electrónico con las instrucciones
                  para recuperar tu contraseña
                </AlertDescription>
              </Alert>
            )}
            {forgotPassword?.isError && (
              <Alert
                status="error"
                mt={4}
                title={forgotPassword?.data?.message}
              >
                <AlertDescription>
                  {forgotPassword?.isError ||
                    "Revisa los datos que has ingresado"}
                </AlertDescription>
              </Alert>
            )}
          </Card.Body>
          <Card.Footer>
            <Link to="/session/login">
              <Button variant="subtle" disabled={forgotPassword.isLoading}>
                Iniciar sesión
              </Button>
            </Link>
            <Link to="/session/register">
              <Button variant="subtle" disabled={forgotPassword.isLoading}>
                Registrate
              </Button>
            </Link>
            <Spacer />
            <Button
              type="submit"
              loading={forgotPassword.isLoading}
              loadingText="Recuperando..."
            >
              Recuperar
            </Button>
          </Card.Footer>
        </Card.Root>
      </form>
    </Stack>
  );
};
