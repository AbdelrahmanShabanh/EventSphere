import { useContext } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
  Box,
} from "@mui/material";
import { AuthContext } from "../context/AuthContext";
import { SettingsContext } from "../context/SettingsContext";
import { useTranslation } from "react-i18next";

function EventCard(props) {
  const event = props.event;
  const isBooked = props.isBooked;

  const authStuff = useContext(AuthContext);
  const { isRtl } = useContext(SettingsContext);
  const { t } = useTranslation();

  function prettyDate(ugly) {
    let d = new Date(ugly);

    let opts = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };

    return d.toLocaleDateString(isRtl ? "ar-SA" : "en-US", opts);
  }

  function shortenText(text, maxLen) {
    if (!text) return "";
    if (text.length <= maxLen) return text;

    return text.substring(0, maxLen) + "...";
  }

  const cardStyle = {
    maxWidth: 345,
    height: "100%",
    display: "flex",
    flexDirection: "column",
    position: "relative",
    transition: "transform 0.2s",
    "&:hover": {
      transform: "translateY(-4px)",
      boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
    },
    textAlign: isRtl ? "right" : "left",
  };

  const badgeStyle = {
    position: "absolute",
    top: 12,
    right: isRtl ? "auto" : 12,
    left: isRtl ? 12 : "auto",
    zIndex: 1,
    fontWeight: "bold",
  };
  return (
    <Card sx={cardStyle}>
      {isBooked && (
        <Chip
          label={t("event.alreadyBooked")}
          color="primary"
          sx={badgeStyle}
        />
      )}

      <CardMedia
        component="img"
        height="160"
        image={event.image || "https://via.placeholder.com/300x160?text=Event"}
        alt={event.name}
        sx={{ objectFit: "cover" }}
      />

      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        <Typography
          gutterBottom
          variant="h6"
          component="div"
          sx={{ fontWeight: "bold" }}
        >
          {event.name}
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {shortenText(event.description, 100)}
        </Typography>

        <Box sx={{ mt: 1 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
            <Box component="span" sx={{ fontWeight: "bold", mr: 1 }}>
              {t("home.date")}:
            </Box>
            {prettyDate(event.date)}
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
            <Box component="span" sx={{ fontWeight: "bold", mr: 1 }}>
              {t("home.venue")}:
            </Box>
            {event.venue}
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
            <Box component="span" sx={{ fontWeight: "bold", mr: 1 }}>
              {t("home.price")}:
            </Box>
            ${event.price}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            <Box component="span" sx={{ fontWeight: "bold", mr: 1 }}>
              {t("home.category")}:
            </Box>
            {event.category}
          </Typography>
        </Box>
      </CardContent>

      <CardActions sx={{ pt: 0, px: 2, pb: 2 }}>
        {!isBooked && authStuff.user ? (
          <Button
            variant="contained"
            component={Link}
            to={`/events/${event._id}`}
            fullWidth
            size="medium"
            sx={{ textTransform: "none" }}
          >
            {t("home.bookNow")}
          </Button>
        ) : !authStuff.user ? (
          <Button
            variant="contained"
            component={Link}
            to="/login"
            fullWidth
            size="medium"
            sx={{ textTransform: "none" }}
          >
            {t("home.loginToBook")}
          </Button>
        ) : (
          <Button
            variant="outlined"
            component={Link}
            to={`/events/${event._id}`}
            fullWidth
            size="medium"
            sx={{ textTransform: "none" }}
          >
            {t("home.viewDetails")}
          </Button>
        )}
      </CardActions>
    </Card>
  );
}

export default EventCard;
