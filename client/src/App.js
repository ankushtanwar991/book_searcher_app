import React, { useState, useEffect } from 'react';
import {
  Container, TextField, Select, MenuItem, Button, List, ListItem,
  ListItemText, IconButton, Dialog, DialogTitle, DialogContent,
  DialogActions, CircularProgress, Typography, Snackbar, Alert,
  Card, CardContent, Divider, Box, Grid
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import { searchBooks, addBook, deleteBook } from './api';
import './App.css';

const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#ff9800' },
    background: { default: '#f4f6f8' },
  },
  typography: {
    fontFamily: "'Inter', sans-serif",
  },
});

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [cat, setCat] = useState('');
  const [writer, setWriter] = useState('');
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalBooks, setTotalBooks] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(4);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [bookToAdd, setBookToAdd] = useState({
    title: '', author: '', category: '', published_date: ''
  });
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' });

  const doSearch = async (pageNum = 1) => {
    setIsLoading(true);
    try {
      const res = await searchBooks(searchTerm, cat, writer, pageNum, pageSize);
      setBooks(res.hits);
      setTotalBooks(res.total);
      setCurrentPage(pageNum);
    } catch {
      setAlert({ open: true, message: 'Could not fetch results', severity: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { doSearch(1); }, []);

  const addNewBook = async () => {
    try {
      await addBook(bookToAdd);
      setAlert({ open: true, message: 'Book added!', severity: 'success' });
      setShowAddDialog(false);
      setBookToAdd({ title: '', author: '', category: '', published_date: '' });
      await doSearch(currentPage);
    } catch {
      setAlert({ open: true, message: 'Adding book failed.', severity: 'error' });
    }
  };

  const removeBook = async (id) => {
    try {
      await deleteBook(id);
      setAlert({ open: true, message: 'Book removed!', severity: 'success' });
      await doSearch(currentPage);
    } catch {
      setAlert({ open: true, message: 'Removing book failed.', severity: 'error' });
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h4" fontWeight="600" color="primary" gutterBottom>
          Book Search App
        </Typography>
        <Card sx={{ p: 3, mb: 3 }}>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} md={5}>
                <TextField
                  label="Title"
                  variant="outlined"
                  fullWidth
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  label="Author"
                  variant="outlined"
                  fullWidth
                  value={writer}
                  onChange={(e) => setWriter(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <Select
                  value={cat}
                  onChange={(e) => setCat(e.target.value)}
                  displayEmpty
                  fullWidth
                >
                  <MenuItem value="">
                    <em>All</em>
                  </MenuItem>
                  <MenuItem value="fiction">Fiction</MenuItem>
                  <MenuItem value="non-fiction">Non-Fiction</MenuItem>
                  <MenuItem value="biography">Biography</MenuItem>
                  <MenuItem value="science">Science</MenuItem>
                </Select>
              </Grid>
              <Grid item xs={12} md={2} display="flex" gap={1}>
                <Button
                  variant="contained"
                  startIcon={<SearchIcon />}
                  fullWidth
                  onClick={() => doSearch(1)}
                  disabled={isLoading}
                >
                  Search
                </Button>
              </Grid>
            </Grid>
            <Box display="flex" justifyContent="flex-end" mt={2}>
              <Button
                variant="outlined"
                color="secondary"
                startIcon={<AddIcon />}
                onClick={() => setShowAddDialog(true)}
              >
                Add Book
              </Button>
            </Box>
          </CardContent>
        </Card>

        {isLoading && (
          <Box display="flex" justifyContent="center" my={4}>
            <CircularProgress />
          </Box>
        )}

        {!isLoading && (
          <Typography variant="subtitle1" mb={2}>
            Found {totalBooks} {totalBooks === 1 ? 'book' : 'books'}
          </Typography>
        )}

        <List>
          {books.map((book, idx) => (
            <Card key={book.id || idx} sx={{ mb: 2 }}>
              <ListItem
                secondaryAction={
                  <IconButton edge="end" color="error" onClick={() => removeBook(book._id)}>
                    <DeleteIcon />
                  </IconButton>
                }
              >
                <ListItemText
                  primary={<Typography fontWeight="500">{book.title}</Typography>}
                  secondary={`Author: ${book.author || 'Unknown'} | Category: ${book.category || 'N/A'} | Published: ${new Date(book.published_date).toLocaleDateString()}`}
                />
              </ListItem>
            </Card>
          ))}
        </List>

        <Divider sx={{ my: 3 }} />

        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Button
            variant="outlined"
            onClick={() => doSearch(currentPage > 1 ? currentPage - 1 : 1)}
            disabled={currentPage === 1 || isLoading}
          >
            Previous
          </Button>
          <Typography>Page {currentPage} of {Math.ceil(totalBooks / pageSize) || 1}</Typography>
          <Button
            variant="outlined"
            onClick={() => doSearch(currentPage + 1)}
            disabled={isLoading || currentPage >= Math.ceil(totalBooks / pageSize)}
          >
            Next
          </Button>
        </Box>

        <Dialog open={showAddDialog} onClose={() => setShowAddDialog(false)} fullWidth maxWidth="sm">
          <DialogTitle>Add New Book</DialogTitle>
          <DialogContent>
            <TextField
              label="Title"
              variant="outlined"
              fullWidth
              value={bookToAdd.title}
              onChange={(e) => setBookToAdd({ ...bookToAdd, title: e.target.value })}
              sx={{ mt: 2, mb: 2 }}
            />
            <TextField
              label="Author"
              variant="outlined"
              fullWidth
              value={bookToAdd.author}
              onChange={(e) => setBookToAdd({ ...bookToAdd, author: e.target.value })}
              sx={{ mb: 2 }}
            />
            <Select
              value={bookToAdd.category}
              onChange={(e) => setBookToAdd({ ...bookToAdd, category: e.target.value })}
              displayEmpty
              fullWidth
              sx={{ mb: 2 }}
            >
              <MenuItem value="">
                <em>Select Category</em>
              </MenuItem>
              <MenuItem value="fiction">Fiction</MenuItem>
              <MenuItem value="non-fiction">Non-Fiction</MenuItem>
              <MenuItem value="biography">Biography</MenuItem>
              <MenuItem value="science">Science</MenuItem>
            </Select>
            <TextField
              label="Published Date"
              type="date"
              variant="outlined"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={bookToAdd.published_date}
              onChange={(e) => setBookToAdd({ ...bookToAdd, published_date: e.target.value })}
              sx={{ mb: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowAddDialog(false)}>Cancel</Button>
            <Button onClick={addNewBook} variant="contained">Add Book</Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={alert.open}
          autoHideDuration={3000}
          onClose={() => setAlert({ ...alert, open: false })}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            severity={alert.severity}
            sx={{ width: '100%' }}
          >
            {alert.message}
          </Alert>
        </Snackbar>
      </Container>
    </ThemeProvider>
  );
}

export default App;
