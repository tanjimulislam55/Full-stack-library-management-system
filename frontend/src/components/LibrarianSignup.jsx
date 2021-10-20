import { Button, TextField, Typography, Box } from "@mui/material";
import { useRef, useState } from "react"
import { Link, useHistory, Redirect } from "react-router-dom"
import { useAuth } from '../context/authContext';
import axios from 'axios'

export default function LibrarianSignup() {

    const fullNameRef = useRef()
    const usernameRef = useRef()
    const passwordRef = useRef()
    const [loading, setLoading] = useState(false)
    const { currentUser } = useAuth()
    const history = useHistory()

    function handleSubmit(e) {
        e.preventDefault()

        setLoading(true)

        // register post request using axios
        axios.post(`${process.env.REACT_APP_API_URL}/student_register`, {
            name: fullNameRef.current.value,
            username: usernameRef.current.value,
            password: passwordRef.current.value,
        }).then(
            res => {
                setLoading(false)
                history.push("/login/librarian")
            }
        ).catch(
            err => {
                setLoading(false)
            }
        )
    }

    return !currentUser ? (
        <Box>
            <form onSubmit={(e) => { handleSubmit(e) }} style={{ width: "18em", margin: "20px auto", display: "grid" }}>
                <Typography color="secondary" variant="h4" component="div" align="center"> Librarian </Typography>
                <TextField label="Full Name" inputRef={fullNameRef} variant="standard" />
                <TextField label="Username" inputRef={usernameRef} variant="standard" />
                <TextField label="Password" type="password" inputRef={passwordRef} variant="standard" />
                <Button size="large" disabled={loading} type="submit" color="primary">Sign Up</Button>
                <Typography align="center">
                    Already have an account? <Link to="/login/librarian">Login</Link>
                </Typography>
            </form>
        </Box>
    ) : <Redirect to="/" />
}