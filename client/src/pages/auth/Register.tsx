import React, { useState } from "react";
import Container from "../../components/containers/Container";
import FormContainer from "../../components/containers/Form";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { z } from "zod";
import MainLayout from "../../components/layouts/MainLayout";
import { useCreateUserMutation } from "../../store/api/userSlice";

const Register = () => {
  const [disabled, setDisabled] = useState(false);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);

  const schema = z.object({
    name: z.string().min(3, "Име и презиме не може бити мање од 3 слова"),
    username: z
      .string().min(5, 'Корисничко име мора да има минимум 5 карактера')
      .regex(/[A-Z]/, 'Корисничко име мора да садржи бар једно велико слово'),
    email: z.string().email('Неважећа електронска пошта'),
    password: z
      .string()
      .min(8, 'Шифра мора да садржи минимум 8 карактера')
      .regex(/[A-Z]/, 'Шифра мора да садржи бар једно велико слово')
      .regex(/[0-9]/, 'Шифра мора да садржи бар један број')
      .regex(/[\W_]/, 'Шифра мора да садржи бар један специјални знак'),
  });

  const [errors, setErrors] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });

  const validateField = (fieldName: string, value: string) => {
    try {
      // @ts-ignore
      schema.pick({ [fieldName]: true }).parse({ [fieldName]: value });
      setErrors((prevErrors) => ({ ...prevErrors, [fieldName]: "" })); // Očisti grešku ako validacija prođe
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [fieldName]: error.errors[0].message, // Prva greška iz validacije
        }));
      }
    }
  };

  const [createUser, { isLoading, isError, isSuccess }] = useCreateUserMutation();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();
    
    try {
      schema.parse({ name, username, email, password });

      setErrors({
        name: "",
        username: "",
        email: "",
        password: "",
      });
      setShowPass(false);
      await createUser({ name, username, email, password });
      console.log("Korisnik uspešno kreiran!");
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessages = error.format();
        setErrors({
          // @ts-ignore
          name: errorMessages.name?._errors[0] || "",
          // @ts-ignore
          username: errorMessages.username?._errors[0] || "",
          // @ts-ignore
          email: errorMessages.email?._errors[0] || "",
          // @ts-ignore
          password: errorMessages.password?._errors[0] || "",
        });
      }
      setDisabled(false);
    }

  };

  return (
    <MainLayout>
      <Container>
        <FormContainer>
          <form method="POST" onSubmit={handleSubmit}>
            <div className="w-full flex flex-col gap-y-3">
              <Input id="name" type="text" label="Име и презиме"  value={name} setValue={(value) => { setName(value); validateField("name", value)}} placeholder="Марко Смилић"/>
              {errors.name && <p className="text-red-500">{errors.name}</p>}
              <Input id="username" type="text" label="Корисничко име"  value={username}  setValue={(value) => { setUsername(value); validateField("username", value)}} placeholder="marko2369"/>
              {errors.username && <p className="text-red-500">{errors.username}</p>}
              <Input id="email" type="email" label="Е-пошта"  value={email} setValue={(value) => { setEmail(value); validateField("email", value)}} placeholder="marko.smilic@pr.ac.rs"/>
              {errors.email && <p className="text-red-500">{errors.email}</p>}
              <Input id="password" type="password" label="Лозинка"  value={password} setValue={(value) => { setPassword(value); validateField("password", value)}} show={showPass} setShow={setShowPass} placeholder="********" />
              {errors.password && <p className="text-red-500">{errors.password}</p>}
            </div>
            <Button type="submit" disabled={disabled} children="Региструј налог" className="mt-5" />
          </form>
        </FormContainer>
      </Container>
    </MainLayout>
  );
};

export default Register;
