import React, { useState } from 'react'
import { NavLink } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import Container from '../../components/containers/Container';
import FormContainer from '../../components/containers/Form';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const ResetPassword = () => {
    const [email, setEmail] = useState("");
    const [disabled, setDisabled] = useState(false);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setDisabled(true);
    
        console.log({email});
        console.log({ PasswordReset: "Password reset not finished!" });
      };

  return (
    <Container >
      <FormContainer>
        <form method="POST" onSubmit={handleSubmit}>
          <div className="w-full flex flex-col gap-y-3">
            <Input id="email" type="email" label="Унесите вашу е-пошту"  value={email} setValue={setEmail} placeholder='marko.smilic@pr.ac.rs' />
          </div>
          <Button type="submit" disabled={disabled} children="Поднесите захтев за нову лозинку" />
        </form>
        <div className="w-full pt-3">
            <NavLink
                to={"/auth/login"}
                className={"text-link text-sm transition w-auto flex gap-2 justify-end items-center"}
            >
                <ChevronLeft />
                <span>Назад на пријаву</span>
            </NavLink>
        </div>
      </FormContainer>
    </Container>
  )
}

export default ResetPassword
