import { Box, AppBar, Toolbar, Typography, Button, Grid, Card, CardActions, CardMedia } from '@mui/material'
import books from '../assets/books.jpg'
import add_book from '../assets/add_book.jpg'
import students from '../assets/students.jpg'
import { Link, useHistory } from 'react-router-dom';
import { useAuth } from '../context/authContext';

export default function Home() {
    const { setCurrentUser, setDidLogin } = useAuth()
    const history = useHistory()

    const handleLogout = () => {
        localStorage.removeItem("token")
        setCurrentUser(null)
        setDidLogin(false)
        history.push("/login/librarian")
    }

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Dashboard
                    </Typography>
                    <Button onClick={handleLogout} color="inherit">Logout</Button>
                </Toolbar>
            </AppBar>
            <Grid sx={{ mt: "8rem", ml: "3rem" }} container >
                <Grid item xs>
                    <Card sx={{ height: 340, width: 300 }}>
                        <CardMedia component="img" height="300" image={books} />
                        <CardActions>
                            <Button component={Link} to="/books/librarian" size="small">BOOKS</Button>
                        </CardActions>
                    </Card>
                </Grid>
                <Grid item xs={6}>
                    <Card sx={{ height: 340, width: 700 }}>
                        <CardMedia component="img" height="300" image={students} />
                        <CardActions>
                            <Button component={Link} to="/students" size="small">STUDENTS</Button>
                        </CardActions>
                    </Card>
                </Grid>
                <Grid item xs>
                    <Card sx={{ height: 340, width: 300 }}>
                        <CardMedia component="img" height="300" image={add_book} />
                        <CardActions>
                            <Button component={Link} to="/add_books" size="small">ADD BOOKS</Button>
                        </CardActions>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    )
}