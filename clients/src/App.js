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
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState('');
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalBooks, setTotalBooks] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(4);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    category: '',
    published_date: '',
  });
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' });

  const fetchBooks = async (page = 1) => {
    setLoading(true);
    try {
      const res = await searchBooks(searchTerm, category, author, page, pageSize);
      setBooks(res.hits);
      setTotalBooks(res.total);
      setCurrentPage(page);
    } catch {
      setAlert({ open: true, message: 'Failed to fetch books.', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks(1);
  }, []);

  const handleAddBook = async () => {
    try {
      await addBook(newBook);
      setAlert({ open: true, message: 'Book added successfully!', severity: 'success' });
      setIsAddDialogOpen(false);
      setNewBook({ title: '', author: '', category: '', published_date: '' });
      fetchBooks(currentPage);
    } catch {
      setAlert({ open: true, message: 'Failed to add book.', severity: 'error' });
    }
  };

  const handleDeleteBook = async (id) => {
    try {
      await deleteBook(id);
      setAlert({ open: true, message: 'Book removed!', severity: 'success' });
      fetchBooks(currentPage);
    } catch {
      setAlert({ open: true, message: 'Failed to remove book.', severity: 'error' });
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h4" fontWeight={600} color="primary" gutterBottom>
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
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <Select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
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
              <Grid item xs={12} md={2}>
                <Button
                  variant="contained"
                  startIcon={<SearchIcon />}
                  fullWidth
                  onClick={() => fetchBooks(1)}
                  disabled={loading}
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
                onClick={() => setIsAddDialogOpen(true)}
              >
                Add Book
              </Button>
            </Box>
          </CardContent>
        </Card>

        {loading && (
          <Box display="flex" justifyContent="center" my={4}>
            <CircularProgress />
          </Box>
        )}

        {!loading && (
          <Typography variant="subtitle1" mb={2}>
            Found {totalBooks} {totalBooks === 1 ? 'book' : 'books'}
          </Typography>
        )}

        <List>
          {books.map((book, idx) => (
            <Card key={book.id || idx} sx={{ mb: 2 }}>
              <ListItem
                secondaryAction={
                  <IconButton edge="end" color="error" onClick={() => handleDeleteBook(book._id)}>
                    <DeleteIcon />
                  </IconButton>
                }
              >
                <ListItemText
                  primary={<Typography fontWeight={500}>{book.title}</Typography>}
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
            onClick={() => fetchBooks(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1 || loading}
          >
            Previous
          </Button>
          <Typography>
            Page {currentPage} of {Math.ceil(totalBooks / pageSize) || 1}
          </Typography>
          <Button
            variant="outlined"
            onClick={() => fetchBooks(currentPage + 1)}
            disabled={loading || currentPage >= Math.ceil(totalBooks / pageSize)}
          >
            Next
          </Button>
        </Box>

        <Dialog open={isAddDialogOpen} onClose={() => setIsAddDialogOpen(false)} fullWidth maxWidth="sm">
          <DialogTitle>Add New Book</DialogTitle>
          <DialogContent>
            <TextField
              label="Title"
              variant="outlined"
              fullWidth
              value={newBook.title}
              onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
              sx={{ mt: 2, mb: 2 }}
            />
            <TextField
              label="Author"
              variant="outlined"
              fullWidth
              value={newBook.author}
              onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
              sx={{ mb: 2 }}
            />
            <Select
              value={newBook.category}
              onChange={(e) => setNewBook({ ...newBook, category: e.target.value })}
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
              value={newBook.published_date}
              onChange={(e) => setNewBook({ ...newBook, published_date: e.target.value })}
              sx={{ mb: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddBook} variant="contained">
              Add Book
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={alert.open}
          autoHideDuration={3000}
          onClose={() => setAlert({ ...alert, open: false })}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert severity={alert.severity} sx={{ width: '100%' }}>
            {alert.message}
          </Alert>
        </Snackbar>
      </Container>
    </ThemeProvider>
  );
}
export default App;
