import { Button, TextField, Container, Box } from "@mui/material";
import { useRef, useState } from "react"
import axios from 'axios'
import bg from '../assets/bg.jpg'
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import MomentUtils from "@date-io/moment";

export default function AddBooks() {
  const [date, setDate] = useState(null)
  const authorRef = useRef()
  const titleRef = useRef()
  const [loading, setLoading] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)

    axios.post(`${process.env.REACT_APP_API_URL}/book_entry`, {
      author: authorRef.current.value,
      title: titleRef.current.value,
      stock_date: date,
      in_stock: true,
      return_date: null
    }, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem("token")}`
      }
    }).then(
      res => {
        authorRef.current.reset()
        titleRef.current.reset()
        setDate(null)
        setLoading(false)
      }
    ).catch(
      err => {
        setLoading(false)
      }
    )
  }

  return (
    <Container maxWidth="xl">

    <Box style={{ 
        backgroundImage: `url(${bg})`, 
        height: "800px", 
        width: "auto", 
        justifyContent: "center", 
        display: "flex" 
      }}>
      <form onSubmit={(e) => { handleSubmit(e) }} 
        style={{ 
          width: "25em", 
          margin: "auto", 
          display: "grid", 
          backgroundColor: "#fff",
          padding: "5px 30px 15px 30px", 
          border: "12px solid turquoise",
        }}
      >
        <TextField label="Author" inputRef={authorRef} variant="standard" />
        <TextField label="Title" inputRef={titleRef} variant="standard" />
        <MuiPickersUtilsProvider utils={MomentUtils}>
          <KeyboardDatePicker
            label="Stock Date"
            value={date}
            format="DD/MM/yyyy"
            placeholder="30/10/2020"
            onChange={(newValue) => {
              setDate(newValue);
            }}
            renderInput={(params) => <TextField {...params} />}
          />
        </MuiPickersUtilsProvider>
        <Button size="large" disabled={loading} type="submit" color="primary">Add Book</Button>
      </form>
    </Box>
    </Container>

  )
}