import { FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Box, Button, Container, TextField, Typography, Link, Paper } from '@mui/material';
import '../styles/style.css'
import { api } from '../utils/authInstance';

type TServerLoginData = {
    access_token: string
}

const Login = () => {
    const navigate = useNavigate();

    const [ErrorMsg, setErrorMsg] = useState('');

    // 로그인
    const onSubmitHandler = async(e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        const body = {
            email: data.get('email'),
            password: data.get('password')
        };
        await api().post<TServerLoginData>(`/auth/login`, body)
        .then(res => {
            if(res.data.access_token) {
                localStorage.setItem('access_token', res.data.access_token);
                navigate('/');
            }
        }).catch(err => {
            setErrorMsg(err.response.data.message)
        });
    };

    // 구글 로그인
    const onSubmitGoogleHandler = async(e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await api().get(`/auth/google`, { withCredentials: true })
        .then(res => {
            console.log('success')
            // if(res.data.access_token) {
                // localStorage.setItem('access_token', res.data.access_token);
                // navigate('/');
            // }
        }).catch(err => {
            console.log(err.response.data)
        });
    };

    return (
        <Container maxWidth='md'>
            <Box className='sign_area'>
                <Paper elevation={2}>
                    <Box className='sign_form_box'>
                        <Typography component="h1" variant="h5">로그인</Typography>
                    </Box>
                    <Box
                        className='sign_form_box'
                        component="form" 
                        onSubmit={onSubmitHandler} 
                        noValidate 
                    >
                        <TextField
                            fullWidth
                            id="email"
                            name="email"
                            label="이메일"
                            autoComplete="email"
                            autoFocus
                            error={ErrorMsg ? true : false}
                        />
                        <TextField
                            fullWidth
                            id="password"
                            name="password"
                            label="비밀번호"
                            type="password"
                            autoComplete="current-password"
                            error={ErrorMsg ? true : false}
                            helperText={ErrorMsg}
                        />
                        {/* <FormControlLabel
                            control={<Checkbox value="remember" color="primary" />}
                            label="이메일 기억하기"
                        /> */}
                        <Button
                            className='sign_button'
                            type="submit"
                            fullWidth
                            variant="contained"
                        >
                            로그인
                        </Button>
                        
                        <Link href="/signup" variant="body2">
                            회원가입하기
                        </Link>
                    </Box>
                    <Box
                        className='sign_form_box'
                        component="form" 
                        onSubmit={onSubmitGoogleHandler} 
                        noValidate 
                    >
                        <Button
                            className='sign_button'
                            type="submit"
                            fullWidth
                            variant="contained"
                            color='error'
                        >
                            Google
                        </Button>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
};

export default Login;