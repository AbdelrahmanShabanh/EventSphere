import { useState, useEffect, useContext, useMemo } from "react";
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Grid,
  Alert,
} from "@mui/material";
import EventCard from "../components/EventCard";
import EventSlider from "../components/EventSlider";
import SearchBar from "../components/SearchBar";
import { getEvents, getUserBookings } from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { useTranslation } from "react-i18next";
import { SettingsContext } from "../context/SettingsContext";

function Home() {
  const [eventList, setEventList] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [myBookings, setMyBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [searchParams, setSearchParams] = useState({
    searchTerm: "",
    category: "",
  });

  const auth = useContext(AuthContext);
  const { isRtl } = useContext(SettingsContext);
  const { t } = useTranslation();

  const categories = useMemo(() => {
    if (!eventList.length) return [];
    const categorySet = new Set(eventList.map((event) => event.category));
    return Array.from(categorySet);
  }, [eventList]);

  useEffect(() => {
    let isMounted = true;

    async function loadEvents() {
      try {
        let events = await getEvents();

        if (isMounted) {
          setEventList(events);
          setFilteredEvents(events);
          setIsLoading(false);
        }
      } catch (err) {
        console.error("Failed to load events:", err);
        if (isMounted) {
          setLoadError("Could not load events. Please try again later.");
          setIsLoading(false);
        }
      }
    }

    loadEvents();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!auth.user) return;

    let isMounted = true;

    async function loadUserBookings() {
      try {
        let bookings = await getUserBookings();
        if (isMounted) {
          setMyBookings(bookings);
        }
      } catch (bookingErr) {
        console.log("Failed to load bookings:", bookingErr);
      }
    }

    loadUserBookings();

    return () => {
      isMounted = false;
    };
  }, [auth.user]);

  useEffect(() => {
    if (!eventList.length) return;

    const { searchTerm, category } = searchParams;

    if (!searchTerm && !category) {
      setFilteredEvents(eventList);
      return;
    }

    const filtered = eventList.filter((event) => {
      if (category && event.category !== category) {
        return false;
      }

      if (searchTerm && searchTerm.trim() !== "") {
        const term = searchTerm.toLowerCase().trim();
        return (
          event.name.toLowerCase().includes(term) ||
          event.venue.toLowerCase().includes(term) ||
          (event.description && event.description.toLowerCase().includes(term))
        );
      }

      return true;
    });

    console.log("Filtering events:", {
      total: eventList.length,
      filtered: filtered.length,
      searchTerm,
      category,
    });

    setFilteredEvents(filtered);
  }, [eventList, searchParams]);

  function hasUserBooked(eventId) {
    if (!myBookings.length) return false;

    for (let i = 0; i < myBookings.length; i++) {
      if (myBookings[i].event._id === eventId) {
        return true;
      }
    }
    return false;
  }

  const handleSearch = (params) => {
    setSearchParams(params);
  };

  if (isLoading) {
    return (
      <Box
        style={{
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

  if (loadError) {
    return (
      <Container maxWidth="lg" style={{ marginTop: "2rem" }}>
        <Box
          style={{
            padding: "2rem",
            textAlign: "center",
            backgroundColor: "#ffebee",
            borderRadius: "4px",
          }}
        >
          <Typography variant="h6" color="error">
            {loadError}
          </Typography>
        </Box>
      </Container>
    );
  }
  return (
    <Box sx={{ pb: 6, pt: 2 }}>
      {eventList.length > 0 && <EventSlider events={eventList} />}

      <Container maxWidth="lg" sx={{ mt: 4, mb: 3 }}>
        <Typography
          variant="h4"
          component="h2"
          gutterBottom
          sx={{
            fontWeight: 600,
            mb: 3,
            textAlign: isRtl ? "right" : "left",
          }}
        >
          {t("home.discoverEvents")}
        </Typography>

        <SearchBar onSearch={handleSearch} categories={categories} />

        {eventList.length > 0 && filteredEvents.length === 0 && (
          <Alert severity="info" sx={{ mb: 3 }}>
            {t("search.noResults")}
          </Alert>
        )}

        <Grid container spacing={3}>
          {filteredEvents.length > 0 ? (
            filteredEvents.map((evt) => (
              <Grid item xs={12} sm={6} md={4} key={evt._id}>
                <EventCard
                  event={evt}
                  isBooked={auth.user ? hasUserBooked(evt._id) : false}
                />
              </Grid>
            ))
          ) : eventList.length > 0 ? (
            <Grid item xs={12}>
              <Box
                sx={{
                  width: "100%",
                  mt: 2,
                  textAlign: "center",
                  p: 4,
                  backgroundColor: "background.paper",
                  borderRadius: 1,
                }}
              >
                <Typography variant="h6" sx={{ color: "text.secondary" }}>
                  {t("search.noResults")}
                </Typography>
              </Box>
            </Grid>
          ) : (
            <Grid item xs={12}>
              <Box
                sx={{
                  width: "100%",
                  mt: 2,
                  textAlign: "center",
                  p: 4,
                  backgroundColor: "background.paper",
                  borderRadius: 1,
                }}
              >
                <Typography variant="h6" sx={{ color: "text.secondary" }}>
                  {t("home.noEvents")}
                </Typography>
                <Typography variant="body1" sx={{ mt: 1 }}>
                  {t("home.checkBack")}
                </Typography>
              </Box>
            </Grid>
          )}
        </Grid>
      </Container>
    </Box>
  );
}

export default Home;
