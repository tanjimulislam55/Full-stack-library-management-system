import { Button, AppBar, Toolbar, Dialog, DialogActions, Backdrop, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress, Container, DialogTitle, Grid, List, ListItem, ListItemText, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import axios from 'axios'
import moment from 'moment'
import { useAuth } from '../../context/authStudentContext'
import { useHistory } from 'react-router-dom';


export default function Books() {

  const { currentUser, setDidLogin, setCurrentUser } = useAuth()
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [didUpdate, setDidUpdate] = useState(false)
  // ------------------------------------------------
  const [bookId, setBookId] = useState('')
  const history = useHistory()


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


  const handleRequestBook = () => {
    setLoading(true)

    axios.put(`${process.env.REACT_APP_API_URL}/student_book_request_${bookId}_${currentUser._id}`, {
      book_id: bookId,
      student_id: currentUser._id,
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


  useEffect(() => {
    const unsubscribe = axios.get(`${process.env.REACT_APP_API_URL}/books&u=s`, {
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


  const handleLogout = () => {
    localStorage.removeItem("token")
    setCurrentUser(null)
    setDidLogin(false)
    history.push("/login/student")
  }

  return (
    <>
      <Container maxWidth="lg" sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Dashboard
            </Typography>
            <Button onClick={handleLogout} color="inherit">Logout</Button>
          </Toolbar>
        </AppBar>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
              <ListItem alignItems="flex-start">
                <ListItemText
                  primary="Student Id"
                  secondary={
                    <>
                      <Typography
                        sx={{ display: 'inline' }}
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                      </Typography>
                      {currentUser._id}
                    </>
                  }
                />
              </ListItem>
              <ListItem alignItems="flex-start">
                <ListItemText
                  primary="Full Name"
                  secondary={
                    <>
                      <Typography
                        sx={{ display: 'inline' }}
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                      </Typography>
                      {currentUser.full_name}
                    </>
                  }
                />
              </ListItem>
              <ListItem alignItems="flex-start">
                <ListItemText
                  primary="Username"
                  secondary={
                    <>
                      <Typography
                        sx={{ display: 'inline' }}
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                      </Typography>
                      {currentUser.username}
                    </>
                  }
                />
              </ListItem>
              <ListItem alignItems="flex-start">
                <ListItemText
                  primary="Roll"
                  secondary={
                    <>
                      <Typography
                        sx={{ display: 'block' }}
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                      </Typography>
                      {currentUser.roll}
                    </>
                  }
                />
              </ListItem>
              <ListItem alignItems="flex-start">
                <ListItemText
                  primary="Department"
                  secondary={
                    <>
                      <Typography
                        sx={{ display: 'block' }}
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                      </Typography>
                      {currentUser.department}
                    </>
                  }
                />
              </ListItem>
              <ListItem alignItems="flex-start">
                <ListItemText
                  primary="Batch"
                  secondary={
                    <>
                      <Typography
                        sx={{ display: 'block' }}
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                      </Typography>
                      {currentUser.batch}
                    </>
                  }
                />
              </ListItem>
              <>{currentUser.book_info && <ListItem alignItems="flex-start">
                <ListItemText
                  primary="Book Information"
                  secondary={
                    <>
                      <Typography
                        sx={{ display: 'block' }}
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        book id: 
                      </Typography>
                      {`  ${currentUser.book_info.book_id}`}
                      <Typography
                        sx={{ display: 'block' }}
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        issue date: 
                      </Typography>
                      {`  ${moment(currentUser.book_info.issue_date).format('MMM DD YYYY')}`}
                      <Typography
                        sx={{ display: 'block' }}
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        return date: 
                      </Typography>
                      {`  ${moment(currentUser.book_info.return_date).format('MMM DD YYYY')}`}
                    </>
                  }
                />
              </ListItem>}</>
              <ListItem alignItems="flex-start">
                <ListItemText
                  primary="Requested Book Id"
                  secondary={
                    <>
                      <Typography
                        sx={{ display: 'inline' }}
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                      </Typography>
                      {`${currentUser.book_req ? currentUser.book_req : "no request"}`}
                    </>
                  }
                />
              </ListItem>
              <ListItem alignItems="flex-start">
                <ListItemText
                  primary="Fine"
                  secondary={
                    <>
                      <Typography
                        sx={{ display: 'inline' }}
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                      </Typography>
                      {`${currentUser.fine === null ? 0 : currentUser.fine} BDT`}
                    </>
                  }
                />
              </ListItem>
            </List>
          </Grid>
          <Grid item xs={8}>
            <Paper style={{ marginTop: "20px" }} elevation={3}>
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }}>
                  <TableHead>
                    <TableRow style={{ backgroundColor: "#0968c6" }} >
                      <TableCell style={{ color: "white" }}>Title</TableCell>
                      <TableCell style={{ color: "white" }} align="right">Author</TableCell>
                      <TableCell style={{ color: "white" }} align="right">Stock Date</TableCell>
                      <TableCell style={{ color: "white" }} align="right">In Stock</TableCell>
                      <TableCell style={{ color: "white" }} align="right">Return Date</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {books && books.map((book, i) => (
                      <TableRow
                        key={book._id}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        style={{ backgroundColor: i % 2 === 0 ? "#d6f2f9" : "#fff" }}
                        onClick={(e) => handleOpenDialog(e, book._id, book.in_stock)}
                      >
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
          </Grid>
        </Grid>
      </Container>
      <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>


      <Dialog open={open} onClose={handleCloseDialog}>
        <DialogTitle>Request for this book?</DialogTitle>
        <DialogActions style={{ padding: "0 15px 18px 0" }}>
          <Button variant="outlined" disabled={loading} color="primary" onClick={handleRequestBook}>Process book</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}