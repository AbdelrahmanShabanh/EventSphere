import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  Chip,
  Divider,
  CircularProgress,
  Alert,
  Stack,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { getEventById, createBooking, getUserBookings } from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { SettingsContext } from "../context/SettingsContext";
import { useTranslation } from "react-i18next";

const EventDetails = () => {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isBooked, setIsBooked] = useState(false);
  const [bookingInProgress, setBookingInProgress] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { isRtl } = useContext(SettingsContext);
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const eventData = await getEventById(id);
        setEvent(eventData);

        if (user) {
          const bookingsData = await getUserBookings();
          const alreadyBooked = bookingsData.some(
            (booking) => booking.event._id === id
          );
          setIsBooked(alreadyBooked);
        }

        setLoading(false);
      } catch (error) {
        setError("Error fetching event details");
        setLoading(false);
      }
    };

    fetchData();
  }, [id, user]);

  const handleBooking = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    setBookingInProgress(true);
    setError(""); // Clear any previous errors

    try {
      await createBooking({ eventId: id, ticketCount: 1 });
      setIsBooked(true);
      setBookingSuccess(true);

      // Refresh user bookings
      try {
        const bookingsData = await getUserBookings();
        // This will update the UI to show the booking was successful
      } catch (bookingErr) {
        console.log("Failed to refresh bookings after booking:", bookingErr);
      }
    } catch (error) {
      console.error("Booking error:", error);

      // Display a more specific error message
      if (error.message) {
        setError(error.message);
      } else if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
      } else {
        setError("Failed to book event. Please try again.");
      }

      // If unauthorized, redirect to login
      if (error.response && error.response.status === 401) {
        // Clear invalid token
        localStorage.removeItem("token");
        setTimeout(() => navigate("/login"), 2000);
      }
    } finally {
      setBookingInProgress(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!event) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">Event not found</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      {bookingSuccess && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Booking successful! You have booked 1 ticket for this event.
        </Alert>
      )}

      <Paper elevation={3} sx={{ overflow: "hidden" }}>
        <Box sx={{ position: "relative" }}>
          <img
            src={event.image}
            alt={event.name}
            style={{ width: "100%", height: "300px", objectFit: "cover" }}
          />

          <Box
            sx={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              p: 2,
              background: "linear-gradient(transparent, rgba(0,0,0,0.7))",
              color: "white",
            }}
          >
            <Typography variant="h4" component="h1">
              {event.name}
            </Typography>

            <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
              <Chip
                label={event.category}
                size="small"
                sx={{
                  color: "white",
                  backgroundColor: "rgba(255,255,255,0.2)",
                }}
              />
              <Chip
                label={`$${event.price}`}
                size="small"
                sx={{
                  color: "white",
                  backgroundColor: "rgba(255,255,255,0.2)",
                }}
              />
            </Box>
          </Box>
        </Box>

        <Box sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", md: "row" },
                  gap: 3,
                }}
              >
                <Box
                  sx={{ flex: "1 1 auto", width: { xs: "100%", md: "auto" } }}
                >
                  <Typography variant="h6" gutterBottom>
                    {t("event.eventDetails")}
                  </Typography>

                  <Stack spacing={1} sx={{ mb: 2 }}>
                    <Typography variant="body1">
                      <strong>{t("home.date")}:</strong>{" "}
                      {formatDate(event.date)}
                    </Typography>
                    <Typography variant="body1">
                      <strong>{t("home.venue")}:</strong> {event.venue}
                    </Typography>
                    <Typography variant="body1">
                      <strong>{t("home.category")}:</strong> {event.category}
                    </Typography>
                  </Stack>

                  <Divider sx={{ my: 2 }} />

                  <Typography variant="h6" gutterBottom>
                    {t("event.description")}
                  </Typography>
                  <Typography variant="body1" paragraph>
                    {event.description}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    width: { xs: "100%", md: "300px" },
                    flexShrink: 0,
                    alignSelf: { xs: "center", md: "flex-start" },
                  }}
                >
                  <Box sx={{ position: "sticky", top: "100px" }}>
                    <Paper
                      elevation={3}
                      sx={{
                        p: 3,
                        backgroundColor:
                          theme.palette.mode === "dark"
                            ? "background.paper"
                            : "#f9f9f9",
                        borderRadius: 2,
                        border:
                          theme.palette.mode === "dark"
                            ? "1px solid rgba(255,255,255,0.1)"
                            : "none",
                      }}
                    >
                      <Typography variant="h6" gutterBottom align="center">
                        {t("event.ticketInfo")}
                      </Typography>

                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          mb: 3,
                        }}
                      >
                        <Typography
                          variant="h3"
                          color="primary"
                          sx={{ fontWeight: "bold" }}
                        >
                          ${event.price}
                        </Typography>
                      </Box>

                      {isBooked ? (
                        <Box sx={{ textAlign: "center" }}>
                          <Chip
                            label={t("event.alreadyBooked")}
                            color="primary"
                            sx={{ mb: 2, py: 1, px: 2, fontSize: "1rem" }}
                          />
                          <Typography variant="body2">
                            {t("event.youHaveBooked")}
                          </Typography>
                        </Box>
                      ) : (
                        <Button
                          variant="contained"
                          color="primary"
                          fullWidth
                          size="large"
                          onClick={handleBooking}
                          disabled={bookingInProgress}
                          sx={{ py: 1.5, fontSize: "1rem", fontWeight: "bold" }}
                        >
                          {bookingInProgress
                            ? t("event.processing")
                            : t("home.bookNow")}
                        </Button>
                      )}

                      <Button
                        variant="outlined"
                        color="primary"
                        fullWidth
                        component={Link}
                        to="/"
                        startIcon={<ArrowBackIcon />}
                        sx={{ mt: 2 }}
                      >
                        {t("event.backToEvents")}
                      </Button>
                    </Paper>
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default EventDetails;
