import { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom';
import { Box, Button, Container, Grid, TextField, Typography, Link, Paper } from '@mui/material';
import '../styles/style.css'
import { api } from '../utils/authInstance';

type TServerSignUpData = {
    Success: boolean;
    message: string;
  }

const SignUp = () => {
    const navigate = useNavigate();

    // 회원가입
    const onSubmitHandler = async(e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        let body = {
            email: data.get('email'),
            username: data.get('username'),
            password: data.get('password'),
            password2: data.get('password2')
        };
        await api().post<TServerSignUpData>(`/users`, body)
        .then(res => {
            if(res.data.Success) {
                navigate('/login');
            }
        })
        .catch(Error => {
            alert(Error.response.data.message);
        });
    };

    return (
        <Container maxWidth='md'>
            <Box className='sign_area'>
                <Paper elevation={2}>
                    <Box className='sign_title_box'>
                        <Typography component="h1" variant="h5">회원가입</Typography>
                    </Box>
                    <Box className='sign_form_box'
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
                            id="username"
                            name="username"
                            label="닉네임"
                            autoComplete="username"
                        />
                        <TextField
                            fullWidth
                            id="password"
                            name="password"
                            label="비밀번호"
                            type="password"
                            autoComplete="current-password"
                        />
                        <TextField
                            fullWidth
                            id="password2"
                            name="password2"
                            label="비밀번호 확인"
                            type="password"
                            autoComplete="current-password"
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                        >
                            회원가입
                        </Button>
                        <Link href="/login" variant="body2">
                            로그인하기
                        </Link>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
};

export default SignUp;