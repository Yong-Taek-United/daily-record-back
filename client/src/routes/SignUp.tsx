import axios from 'axios';
import React, { ChangeEvent, FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom';

const SignUp = () => {

    const navigate = useNavigate();

    const [Name, setName] = useState("");
    const [Email, setEmail] = useState("");
    const [Password, setPassword] = useState("");
    const [Password2, setPassword2] = useState("");

    const onEmailHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setEmail(e.currentTarget.value);
    };
    const onNameHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setName(e.currentTarget.value);
    };
    const onPasswordHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setPassword(e.currentTarget.value);
    };
    const onPassword2Handler = (e: ChangeEvent<HTMLInputElement>) => {
        setPassword2(e.currentTarget.value);
    };

    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        let body = {
            email: Email,
            username: Name,
            password: Password,
            password2: Password2
        };
        axios.post('http://localhost:5000/users', body)
        .then(res => {
            if(res.data.Success) {
                alert(res.data.message);
                navigate('/login');
            }
        })
        .catch(Error => {
            alert(Error.response.data.message);
        });
    };

    return (
        <div>
            <form style={{display: 'flex', flexDirection: 'column'}} onSubmit={onSubmit}>
                <label>Email</label>
                <input type='email' value={Email} onChange={onEmailHandler} />
                <label>Name</label>
                <input type='name' value={Name} onChange={onNameHandler} />
                <label>Passoword</label>
                <input type='password' value={Password} onChange={onPasswordHandler} />
                <label>Confirm Passoword</label>
                <input type='password' value={Password2} onChange={onPassword2Handler} />
                <br />
                <input type='submit' value='Sign up' />
            </form>
          </div>
    )
}

export default SignUp