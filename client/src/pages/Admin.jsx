import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import api from "../utils/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
  TablePagination,
  TextField,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import PeopleIcon from "@mui/icons-material/People";
import SearchIcon from "@mui/icons-material/Search";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import { styled } from "@mui/system";

const StyledCard = styled(Card)({
  background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
  color: "white",
});

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#FF6666",
  "#FF33CC",
  "#9933FF",
  "#66CCFF",
  "#669999",
  "#CCCCFF",
];

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [questionLoading, setQuestionLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchText, setSearchText] = useState("");
  const [question, setQuestion] = useState("");
  const [option1, setOption1] = useState("");
  const [option2, setOption2] = useState("");
  const [option3, setOption3] = useState("");
  const [option4, setOption4] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [totalQuestions, setTotalQuestions] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersResponse = await api.get("/admin/users");
        setUsers(usersResponse.data);
        setTotalUsers(usersResponse.data.length);

        const questionsResponse = await api.get("/admin/total-questions");
        setTotalQuestions(questionsResponse.data.totalQuestions);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to fetch data.");
        if (error.response && error.response.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
    setPage(0);
  };

  const handleQuestionSubmit = async (event) => {
    event.preventDefault();
    setQuestionLoading(true);
    try {
      await api.post("/admin/question", {
        question,
        options: [option1, option2, option3, option4],
        correctAnswer,
      });
      toast.success("Question of the Day submitted successfully!");
      setQuestion("");
      setOption1("");
      setOption2("");
      setOption3("");
      setOption4("");
      setCorrectAnswer("");
    } catch (error) {
      console.error("Error submitting question:", error);
      toast.error("Failed to submit the question.");
    } finally {
      setQuestionLoading(false);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchText.toLowerCase()) ||
      user.email.toLowerCase().includes(searchText.toLowerCase())
  );

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <CircularProgress />
      </div>
    );
  }

  // Sorting users by totalScore in descending order and selecting top 10
  const sortedUsers = filteredUsers.sort((a, b) => b.totalScore - a.totalScore);
  const topTenUsers = sortedUsers.slice(0, 10);

  const chartData = topTenUsers.map((user) => ({
    name: user.name,
    totalScore: user.totalScore,
  }));

  const paginatedUsers = filteredUsers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const getGreeting = () => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) {
      return "Good morning";
    } else if (currentHour < 16) {
      return "Good afternoon";
    } else {
      return "Good evening";
    }
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <StyledCard>
            <CardContent>
              <Typography variant="h5" component="div" gutterBottom>
                {getGreeting()}, Admin
              </Typography>
              <Typography variant="body1" component="p">
                Welcome to the admin dashboard. Here you can manage & visualize
                user data and track their progress.
              </Typography>
              <Button
                variant="contained"
                color="secondary"
                startIcon={<LogoutIcon />}
                onClick={handleLogout}
                sx={{ mt: 2 }}
              >
                Log Out
              </Button>
            </CardContent>
          </StyledCard>
        </Grid>

        {/* Add Question Form */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="div" gutterBottom>
                Add Question of the Day
              </Typography>
              <form onSubmit={handleQuestionSubmit}>
                <TextField
                  label="Question"
                  fullWidth
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  required
                  sx={{ mb: 2 }}
                />
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      label="Option 1"
                      fullWidth
                      value={option1}
                      onChange={(e) => setOption1(e.target.value)}
                      required
                      sx={{ mb: 2 }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Option 2"
                      fullWidth
                      value={option2}
                      onChange={(e) => setOption2(e.target.value)}
                      required
                      sx={{ mb: 2 }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Option 3"
                      fullWidth
                      value={option3}
                      onChange={(e) => setOption3(e.target.value)}
                      required
                      sx={{ mb: 2 }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Option 4"
                      fullWidth
                      value={option4}
                      onChange={(e) => setOption4(e.target.value)}
                      required
                      sx={{ mb: 2 }}
                    />
                  </Grid>
                </Grid>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel id="correct-answer-label">
                    Correct Answer
                  </InputLabel>
                  <Select
                    labelId="correct-answer-label"
                    value={correctAnswer}
                    onChange={(e) => setCorrectAnswer(e.target.value)}
                    required
                  >
                    <MenuItem value="option1">Option 1</MenuItem>
                    <MenuItem value="option2">Option 2</MenuItem>
                    <MenuItem value="option3">Option 3</MenuItem>
                    <MenuItem value="option4">Option 4</MenuItem>
                  </Select>
                </FormControl>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={questionLoading}
                >
                  {questionLoading ? "Submitting..." : "Submit Question"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
          <Card>
            <CardContent sx={{ display: "flex", alignItems: "center" }}>
              <PeopleIcon sx={{ fontSize: 40, marginRight: 2 }} />
              <div>
                <Typography variant="h6" component="div">
                  Total Users
                </Typography>
                <Typography variant="h3" component="div">
                  {totalUsers}
                </Typography>
              </div>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
          <Card>
            <CardContent sx={{ display: "flex", alignItems: "center" }}>
              <QuestionAnswerIcon sx={{ fontSize: 40, marginRight: 2 }} />
              <div>
                <Typography variant="h6" component="div">
                  Total Questions
                </Typography>
                <Typography variant="h3" component="div">
                  {totalQuestions}
                </Typography>
              </div>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={8} lg={8} xl={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="div">
                User Scores
              </Typography>
              <Box sx={{ height: 400 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="totalScore" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="div">
                Most Active Users
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="totalScore"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    label
                  >
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <TableContainer component={Paper}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: 2,
                  }}
                >
                  <TextField
                    value={searchText}
                    onChange={handleSearchChange}
                    label="Search Users"
                    variant="outlined"
                    size="small"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>User Name</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Total Score</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedUsers.map((user) => (
                      <TableRow key={user._id}>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.totalScore}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={filteredUsers.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <ToastContainer />
    </Box>
  );
};

export default Admin;
