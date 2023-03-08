import { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom';
import { Box, Button, Container, Grid, TextField, Typography, Link, Paper } from '@mui/material';
import '../styles/style.css'
import { api } from '../utils/authInstance';

type TServerLoginData = {
    access_token: string
}

const Login = () => {
    const navigate = useNavigate();

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
            } else {
                alert('Error');
            }
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
                        />
                        <TextField
                            fullWidth
                            id="password"
                            name="password"
                            label="비밀번호"
                            type="password"
                            autoComplete="current-password"
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
                </Paper>
            </Box>
        </Container>
    );
};

export default Login;