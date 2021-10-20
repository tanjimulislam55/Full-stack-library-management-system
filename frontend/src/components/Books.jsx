import { Button, Dialog, DialogContent, TextField, DialogActions, Backdrop, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress, Container } from "@mui/material";
import { useEffect, useState, useRef } from "react";
import axios from 'axios'
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import MomentUtils from "@date-io/moment";
import moment from 'moment'


export default function Books() {

  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [didUpdate, setDidUpdate] = useState(false)
  // ------------------------------------------------
  const [issueDate, setIssueDate] = useState(new Date())
  const [returnDate, setReturnDate] = useState(new Date())
  const studentIdRef = useRef()
  const [bookId, setBookId] = useState('')


  const handleOpenDialog = (e, id, stock) => {
    if (stock) {
      setBookId(id)
      setOpen(true)
    }
  }
  
  const handleCloseDialog = () => {
    setBookId('')
    setOpen(false)
  }


  const handleProcessBook = () => {
    setLoading(true)

    axios.put(`${process.env.REACT_APP_API_URL}/process_book_request`, {
      student_id: studentIdRef.current.value,
      book_id: bookId,
      issue_date: issueDate,
      return_date: returnDate
    }, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem("token")}`
      }
    }).then(
      res => {
        setLoading(false)
        setDidUpdate(true)
        setOpen(false)
      }
    ).catch(
      err => {
        setLoading(false)
      }
    )
  }


  const handleDeleteBook = () => {
    setLoading(true)

    axios.delete(`${process.env.REACT_APP_API_URL}/delete_a_book/${bookId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem("token")}`
      }
    }).then(
      res => {
        setLoading(false)
        setDidUpdate(true)
        setOpen(false)
      }
    ).catch(
      err => {
        setLoading(false)
      }
    )
  }
  

  useEffect(() => {
    const unsubscribe = axios.get(`${process.env.REACT_APP_API_URL}/books&u=l`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem("token")}`
      },
    }).then(
      res => {
        setBooks(res.data)
        setLoading(false)
      }
    ).catch(
      err => {
        setBooks([])
        setLoading(false)
      }
    )

    return () => unsubscribe
  }, [didUpdate])

  return (
    <>
      <Container maxWidth="lg">
        <Paper style={{ marginTop: "20px" }} elevation={3}>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow style={{ backgroundColor: "#c66a35" }} >
                  <TableCell>Title</TableCell>
                  <TableCell align="right">Author</TableCell>
                  <TableCell align="right">Stock Date</TableCell>
                  <TableCell align="right">In Stock</TableCell>
                  <TableCell align="right">Return Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {books && books.map((book, i) => (
                  <TableRow 
                    key={book._id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }} 
                    style={{ backgroundColor: i%2===0 ? "#f6f7ef": "#fff" }}
                    onClick={(e) => handleOpenDialog(e, book._id, book.in_stock)}
                  >
                    {/* <ProcessBook open={open} book={book} setDidUpdate={setDidUpdate} handleCloseDialog={handleCloseDialog} /> */}
                    <TableCell component="th" scope="row">
                      {book.title}
                    </TableCell>
                    <TableCell align="right">{book.author}</TableCell>
                    <TableCell align="right">{moment(book.stock_date).format('MMM DD YYYY')}</TableCell>
                    <TableCell align="right">{book.in_stock ? "Yes" : "No"}</TableCell>
                    <TableCell align="right">{book.return_date ? moment(book.return_date).format('MMM DD YYYY') : "None"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Container>
      <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>


      <Dialog open={open} onClose={handleCloseDialog}>
        <DialogContent style={{ display: "grid" }}>
          <TextField variant="standard" label="Student Id" inputRef={studentIdRef} />
          <MuiPickersUtilsProvider utils={MomentUtils}>
            <KeyboardDatePicker
              label="Issue Date"
              value={issueDate}
              format="DD/MM/yyyy"
              placeholder="30/10/2020"
              minDate={new Date()}
              onChange={(newValue) => {
                setIssueDate(newValue);
              }}
              renderInput={(params) => <TextField {...params} />}
            />
          </MuiPickersUtilsProvider>
          <MuiPickersUtilsProvider utils={MomentUtils}>
            <KeyboardDatePicker
              label="Return Date"
              value={returnDate}
              format="DD/MM/yyyy"
              minDate={new Date()}
              placeholder="30/10/2020"
              onChange={(newValue) => {
                setReturnDate(newValue);
              }}
              renderInput={(params) => <TextField {...params} />}
            />
          </MuiPickersUtilsProvider>
        </DialogContent>
        <DialogActions style={{ padding: "0 15px 18px 0"}}>
          <Button variant="contained" disabled={loading} color="primary" onClick={handleProcessBook}>Process book</Button>
          <Button variant="contained" disabled={loading} color="primary" onClick={handleDeleteBook}>Delete</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}