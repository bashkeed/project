import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import api from "../utils/api";
import LoaderDash from "../components/LoaderDash";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
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
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import PeopleIcon from "@mui/icons-material/People";
import { styled } from "@mui/system";

const StyledCard = styled(Card)({
  background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
  color: "white",
});

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersResponse = await api.get("/admin/users");
        setUsers(usersResponse.data);
        setTotalUsers(usersResponse.data.length);
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

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <LoaderDash />
      </div>
    );
  }

  const chartData = users.map((user) => ({
    name: user.name,
    totalScore: user.totalScore,
  }));

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <StyledCard>
            <CardContent>
              <Typography variant="h4" component="div" gutterBottom>
                Admin Dashboard
              </Typography>
              <Typography variant="body1" component="p">
                Welcome to the admin dashboard. Here you can manage user data
                and track their progress.
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
        <Grid item xs={12}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell>Username</TableCell>
                  <TableCell>Phone Number</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Total Score</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user, index) => (
                  <TableRow key={user._id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{user.name.toUpperCase()}</TableCell>
                    <TableCell>{user.number}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.totalScore}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
      <ToastContainer />
    </Box>
  );
};

export default Admin;
