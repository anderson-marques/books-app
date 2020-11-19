import React, { useEffect, useRef, useState } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Collapse from '@material-ui/core/Collapse';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';

import axios from 'axios';

const { BOOKS_API_URL } = process.env;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      '& > *': {
        margin: theme.spacing(1),
        width: '25ch',
      },
    },
    table: {
      minWidth: 650,
    },
  }),
);

const useRowStyles = makeStyles({
  root: {
    '& > *': {
      borderBottom: 'unset',
    },
  },
});

type BookModel = {
  id?: string;
  title: string;
  authors: string;
  image: string;
};

const imageCss = {
  border: '1px solid #ddd',
  borderRadius: '4px',
  padding: '5px',
  width: '300px',
};

function Row(props: { row: BookModel }) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);
  const classes = useRowStyles();

  return (
    <React.Fragment>
      <TableRow className={classes.root}>
        <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row.title}
        </TableCell>
        <TableCell align="right">{row.authors}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <img src={row.image} style={imageCss} alt={row.title} />
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

const Book = () => {
  const classes = useStyles();

  const emptyBookList: Array<BookModel> = [];
  const [bookList, setBookList] = useState(emptyBookList);
  const [inputTitle, setInputTitle] = useState('');
  const [inputAuthors, setInputAuthors] = useState('');
  const [inputImage, setInputImage] = useState('');

  useEffect(() => {
    fetch(`${BOOKS_API_URL}/books`)
      .then((res) => res.json())
      .then((data) => {
        setBookList(data.books);
      })
      .catch(console.log);
  }, []);

  const fieldsNotSet = () => inputTitle.length === 0 || inputAuthors.length === 0 || inputImage.length === 0;

  const addBook = () => {
    const newBook: BookModel = {
      title: inputTitle,
      authors: inputAuthors,
      image: inputImage,
    };

    axios
      .post(`${BOOKS_API_URL}/books`, newBook)
      .then((_) => {
        const newBookList: Array<BookModel> = [...bookList, newBook];
        setBookList(newBookList);
      })
      .catch((err) => {
        console.error(`Error creating the new book`, err);
      });
  };

  return (
    <div>
      <div className="card">
        <div className="card-body">
          <h3>What is your best book?:</h3>
          <form className={classes.root} noValidate autoComplete="off">
            <TextField
              id="outlined-basic"
              fullWidth
              label="Title"
              variant="outlined"
              required={true}
              size="small"
              onChange={(e) => setInputTitle(e.target.value)}
            />
            <br />
            <TextField
              id="outlined-basic"
              label="Authors"
              variant="outlined"
              required={true}
              size="small"
              onChange={(e) => setInputAuthors(e.target.value)}
            />
            <br />
            <TextField
              id="outlined-basic"
              fullWidth
              label="image"
              variant="outlined"
              required={true}
              size="small"
              onChange={(e) => setInputImage(e.target.value)}
            />
            <br />
            <Button variant="contained" onClick={addBook} disabled={fieldsNotSet()}>
              <AddIcon />
            </Button>
          </form>
        </div>
        <TableContainer component={Paper}>
          <Table aria-label="collapsible table">
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell>Title</TableCell>
                <TableCell align="right">Authors</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bookList.map((book: BookModel, index: number) => (
                <Row key={index} row={book} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};

export default Book;
