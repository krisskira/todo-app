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
import { PasswordInput } from "@/components/ui/password-input";
import { Alert } from "@/components/ui/alert";
export type LoginPageProps = {
  children?: React.ReactNode;
};

export const LoginPage: React.FC<LoginPageProps> = () => {
  const { login } = useSession();
  const recipe = useRecipe({ recipe: ShadowRecipe });
  const styles = recipe({ look: "aurora" });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = ({ email, password }) => {
    login.execute(email, password);
  };

  return (
    <Stack gap="4" align="center" maxW="full">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card.Root css={styles} maxW="xl" p="4">
          <Card.Header>
            <Card.Title>Iniciar sesión</Card.Title>
            <Card.Description>
              Inicia sesión para acceder a tus listado de tareas
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
                  placeholder="john.doe@example.com"
                  {...register("email", {
                    required: {
                      value: true,
                      message: "El correo electrónico es requerido",
                    },
                    pattern: {
                      value:
                        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                      message: "El correo electrónico no es válido",
                    },
                  })}
                />
              </Field>

              <Field
                label="Contraseña"
                invalid={!!errors.password}
                errorText={errors.password?.message}
              >
                <PasswordInput
                  type="password"
                  placeholder="Escribe tu contraseña"
                  {...register("password", {
                    required: {
                      value: true,
                      message: "La contraseña es requerida",
                    },
                  })}
                />
              </Field>
            </Stack>
            {login?.isError && (
              <Alert status="error" mt={4} title={"Errores de validación"}>
                <AlertDescription>
                  Revisa los datos que has ingresado
                </AlertDescription>
              </Alert>
            )}
          </Card.Body>
          <Card.Footer>
            <Button
              asChild
              p={0}
              m={0}
              variant="plain"
              disabled={login.isLoading}
            >
              <Link to="/session/forgot">¿Olvidaste tu contraseña?</Link>
            </Button>
            <Spacer />
            <Link to="/session/register">
              <Button variant="surface" disabled={login.isLoading}>
                Registrate
              </Button>
            </Link>
            <Button
              type="submit"
              loading={login.isLoading}
              loadingText="Iniciando sesión..."
            >
              Iniciar sesión
            </Button>
          </Card.Footer>
        </Card.Root>
      </form>
    </Stack>
  );
};

type Inputs = {
  email: string;
  password: string;
};
