  import React, { useState } from "react";
  import { useNavigate } from "react-router-dom";
  import Container from "../../components/containers/Container";
  import FormContainer from "../../components/containers/Form";
  import Input from "../../components/ui/Input";
  import Button from "../../components/ui/Button";
  import { useLoginMutation } from "../../store/api/sessionSlice";
  import { useAppDispatch } from "../../store/hooks";
  import { setTokens } from "../../store/slices/sessionSlice";
  import Loader from "../../components/ui/Loader/Loader";
  import { setUser } from "../../store/slices/userSlice";

  const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [disabled, setDisabled] = useState(false);
    const [showPass, setShowPass] = useState(false);

    const [login, { isLoading }] = useLoginMutation();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      event.stopPropagation();
      setShowPass(false);
      setDisabled(true);
      
      try {
        const { userId, username: name , email, role, accessToken, refreshToken } = await login({
          login: username,
          password,
        }).unwrap();

        dispatch(setTokens({ accessToken, refreshToken }));
        await dispatch(setUser({id: userId, username: name, email, role}));
        
        if( role === 'user' ) navigate('/')
        if( role === 'service' ) navigate('/departments/')
        if( role === 'admin' ) navigate('/universities/')
          
      } catch (error) {
        console.error("Login failed:", error);
        setDisabled(false);
      }
    };
    
    if (isLoading) return <Loader />

    return (
      <Container>
        <FormContainer>
          <form method="POST" onSubmit={handleSubmit}>
            <div className="w-full flex flex-col gap-y-3">
              <Input id="username" type="text" label="Корисничко име"  value={username} setValue={setUsername}/>
              <Input id="password" type="password" label="Лозинка" withPassForgot  value={password} setValue={setPassword} show={showPass} setShow={setShowPass} />
            </div>
            <Button type="submit" disabled={disabled} children="Пријавите се" />
          </form>
          {/* <div className="w-full text-right pt-3">
            <NavLink
              to={"/auth/register"}
              className={"text-link text-sm transition"}
            >
              Немате налог? Регистрација
            </NavLink>
          </div> */}
        </FormContainer>
      </Container>
    );
  };

  export default Login;