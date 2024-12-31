import { SubmitHandler, useForm } from "react-hook-form";
import useSession from "../../hooks/session.hook";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import {
  AlertDescription,
  Card,
  Group,
  Input,
  Spacer,
  Stack,
  useRecipe,
} from "@chakra-ui/react";
import { Field } from "@/components/ui/field";
import { Link } from "react-router";
import { ShadowRecipe } from "@/core/config/theme";
import { PasswordInput } from "@/components/ui/password-input";
import { RegisterPostDtoSchema } from "todo-types";

export type RegisterPageProps = {
  children?: React.ReactNode;
};

export const RegisterPage: React.FC<RegisterPageProps> = () => {
  const recipe = useRecipe({ recipe: ShadowRecipe });
  const styles = recipe({ look: "aurora" });

  const { register: userRegister } = useSession();
  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RegisterPostDtoSchema>();

  const onSubmit: SubmitHandler<RegisterPostDtoSchema> = (data) => {
    userRegister.execute(data).then(() => {
      reset();
    });
  };

  return (
    <Stack gap="4" align="center" maxW="full">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card.Root css={styles} minW="md" maxW="xl" p="4">
          <Card.Header>
            <Card.Title>Registrate</Card.Title>
            <Card.Description>
              Crea una cuenta para acceder a tus listado de tareas
            </Card.Description>
          </Card.Header>
          <Card.Body>
            <Stack gap="4" align="flex-start" maxW="full">
              <Group w="full">
                <Field
                  label="Nombre"
                  invalid={!!errors.firstName}
                  errorText={errors.firstName?.message}
                >
                  <Input
                    placeholder="John"
                    {...registerField("firstName", {
                      required: {
                        value: true,
                        message: "El nombre es requerido",
                      },
                      minLength: {
                        value: 2,
                        message: "El nombre debe tener al menos 2 caracteres",
                      },
                      maxLength: {
                        value: 50,
                        message:
                          "El nombre no puede tener más de 50 caracteres",
                      },
                    })}
                  />
                </Field>

                <Field
                  label="Apellido"
                  invalid={!!errors.lastName}
                  errorText={errors.lastName?.message}
                >
                  <Input
                    placeholder="Doe"
                    {...registerField("lastName", {
                      required: {
                        value: true,
                        message: "El apellido es requerido",
                      },
                      minLength: {
                        value: 2,
                        message: "El apellido debe tener al menos 2 caracteres",
                      },
                      maxLength: {
                        value: 50,
                        message:
                          "El apellido no puede tener más de 50 caracteres",
                      },
                    })}
                  />
                </Field>
              </Group>
              <Field
                label="Correo electrónico"
                invalid={!!errors.email}
                errorText={errors.email?.message}
              >
                <Input
                  required
                  placeholder="john.doe@example.com"
                  type="email"
                  {...registerField("email", {
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
                  required
                  type="password"
                  placeholder="Escribe tu contraseña"
                  {...registerField("password")}
                />
              </Field>
            </Stack>

            {userRegister?.data?.message === "user_created" && (
              <Alert status="success" mt={4} title="¡Registro exitoso!">
                <AlertDescription>
                  Te has registrado correctamente, ahora puedes ingresar
                </AlertDescription>
              </Alert>
            )}

            {userRegister?.isError && (
              <Alert
                status="error"
                mt={4}
                title={userRegister?.data?.message || "Errores de validación"}
              >
                <AlertDescription>
                  {userRegister?.data?.data ||
                    "Revisa los datos que has ingresado"}
                </AlertDescription>
              </Alert>
            )}
          </Card.Body>
          <Card.Footer>
            <Button asChild variant="plain" p={0} shadow={"none"}>
              <Link to="/session/forgot">¿Olvidaste tu contraseña?</Link>
            </Button>
            <Spacer />
            <Link to="/session/login">
              <Button variant="surface" disabled={userRegister.isLoading}>
                Iniciar sesión
              </Button>
            </Link>
            <Button
              type="submit"
              loading={userRegister.isLoading}
              loadingText="Registrando..."
            >
              Registrate
            </Button>
          </Card.Footer>
        </Card.Root>
      </form>
    </Stack>
  );
};
