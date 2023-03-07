import { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom';
import { Box, Button, Container, Grid, TextField, Typography, Link } from '@mui/material';
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
        <Container
            maxWidth="lg"
            sx={{height: '100vh'}}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    pt: 18
                }}
            >
                <Typography component="h1" variant="h5">회원가입</Typography>
                <Box component="form" onSubmit={onSubmitHandler} noValidate sx={{ mt: 1, width: '30vw', minWidth: 220}}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        name="email"
                        label="이메일"
                        autoComplete="email"
                        autoFocus
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="username"
                        name="username"
                        label="닉네임"
                        autoComplete="username"
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="password"
                        name="password"
                        label="비밀번호"
                        type="password"
                        autoComplete="current-password"
                    />
                    <TextField
                        margin="normal"
                        required
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
                        sx={{ mt: 3, mb: 2 }}
                    >
                    회원가입
                    </Button>
                    <Grid container>
                        <Grid item xs>
                            <Link href="/login" variant="body2">
                            로그인하기
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Container>
    );
};

export default SignUp;