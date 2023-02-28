import React, { ChangeEvent, FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { api } from '../utils/authInstance';

type ServerData = {
    access_token: string
  }

const Login = () => {
    const navigate = useNavigate();

    const [Email, setEmail] = useState("");
    const [Password, setPassword] = useState("");

    const onEmailHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setEmail(e.currentTarget.value);
    };

    const onPasswordHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setPassword(e.currentTarget.value);
    };
    const onSubmit = async(e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        let body = {
            email: Email,
            password: Password
        };
        await api().post<ServerData>(`/auth/login`, body)
        .then(res => {
            if(res.data.access_token) {
                localStorage.setItem('access_token', res.data.access_token)
                navigate('/');
            } else {
                alert('Error');
            }
        });
    };

    return (
        <div>
            <h2>Login</h2>
            <form style={{display: 'flex', flexDirection: 'column'}} onSubmit={onSubmit}>
            <label>Email</label>
            <input type='email' value={Email} onChange={onEmailHandler} />
            <label>Passoword</label>
            <input type='password' value={Password} onChange={onPasswordHandler} />
            <br />
            <input type='submit' value='Login' />
            </form>
        </div>
    )
}

export default Login