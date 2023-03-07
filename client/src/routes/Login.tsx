import { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom';
import { Box, Button, Container, Grid, TextField, Typography, Link } from '@mui/material';
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
                <Typography component="h1" variant="h5">로그인</Typography>
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
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                    로그인
                    </Button>
                    <Grid container>
                        <Grid item xs>
                            <Link href="/signup" variant="body2">
                            회원가입하기
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Container>
    );
};

export default Login;