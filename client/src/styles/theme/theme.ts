import styled from "@emotion/styled";
import { createTheme, responsiveFontSizes } from "@mui/material";

const theme = responsiveFontSizes(
    createTheme({
        typography: {
            h6: {
                fontSize: 20,
                fontWeight: 600,
                marginRight: 2 ,
            },
            body1: {
                fontSize: 16,
                fontWeight: 600,
            },
            body2: {
                fontSize: 12,
                fontWeight: 600,
            }
        },
        components: {
            MuiCssBaseline: {
                styleOverrides: {
                    "*": {
                        boxSizing: "border-box",
                        margin: 0,
                        padding: 0,
                    },
                    html: {
                        height: "100%",
                        width: "100%",
                    },
                    body: {
                        height: "100%",
                        width: "100%",
                    },
                    "#root": {
                        height: "100%",
                        width: "100%",
                    }
                }
            },
            MuiContainer: {
                defaultProps: {
                    maxWidth: 'lg',
                    style: {
                        height: '100vh',
                    }
                },styleOverrides: {
                    maxWidthMd: {
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }
                }
            },
            MuiAppBar:{
                defaultProps: {
                    style: {
                        justifyContent: 'center',
                        height: 48,

                    }
                }
            },
            MuiTextField: {
                defaultProps: {
                    required: true,
                    margin: 'normal',
                    size: 'small',
                },
            },
            MuiButton: {
                defaultProps: {
                    style: {
                        fontWeight: 700,
                    }
                },
                styleOverrides: {
                    fullWidth: {
                        marginTop: 24,
                        marginBottom: 16,
                    }
                }
            },
            MuiPaper: {
                styleOverrides: {
                    elevation2: {
                        padding: 32,
                        borderRadius: 12,
                    }
                }
            },
            MuiCard: {
                defaultProps: {
                    elevation: 3,
                    style: {
                        display: 'flex',
                        flexDirection: 'column',
                        width: 158,
                        margin: 0,
                        padding: 5,
                        borderRadius: 4
                    },
                },
                styleOverrides: {
                    root: ({ ownerState }) => ({
                        ...(ownerState.elevation === 1 ? {
                            backgroundColor: '#1976d2',
                            color: '#fff',
                            height: 40
                        } : {
                            backgroundColor: '#e4e6e5',
                            height: 96
                        }
                        ),
                    }),
                },
            },
            MuiCardContent: {
                defaultProps: {
                    style: {
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100%',
                        marginLeft: 3,
                        marginTop: 5,
                        padding: 0,
                        overflow: 'hidden',
                    },
                },
            },
            MuiLink: {
                defaultProps: {
                    underline: 'hover',
                    style: {
                        fontWeight: 500,
                    }
                },
            },
            MuiIconButton: {
                defaultProps: {
                    size: 'small',
                    color: 'inherit',
                },
            },
            MuiMenuItem: {
                defaultProps: {
                    style: {
                        fontSize: 14,
                        fontWeight: 600,
                    }
                }
            },
            MuiChip: {
                defaultProps: {
                    style: {
                        fontSize: 17,
                        fontWeight: 500,
                    }
                }
            },
        }
    })
);

export default theme;