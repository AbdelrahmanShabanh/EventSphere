import { useContext } from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import { Box, Typography, Button, Paper, Container } from "@mui/material";
import { useTranslation } from "react-i18next";
import { SettingsContext } from "../context/SettingsContext";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./slick-custom.css";

const CustomNextArrow = ({ className, style, onClick, isRtl }) => {
  return (
    <div
      className={className}
      style={{
        ...style,
        display: "block",
        zIndex: 1,
      }}
      onClick={onClick}
    ></div>
  );
};

const CustomPrevArrow = ({ className, style, onClick, isRtl }) => {
  return (
    <div
      className={className}
      style={{
        ...style,
        display: "block",
        zIndex: 1,
      }}
      onClick={onClick}
    ></div>
  );
};

const EventSlider = ({ events }) => {
  const { t } = useTranslation();
  const { isRtl } = useContext(SettingsContext);

  if (!events || events.length === 0) {
    return null;
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(isRtl ? "ar-SA" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    rtl: isRtl,
    responsive: [
      {
        breakpoint: 600,
        settings: {
          arrows: false,
        },
      },
    ],
    nextArrow: <CustomNextArrow isRtl={isRtl} />,
    prevArrow: <CustomPrevArrow isRtl={isRtl} />,
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 2, mb: 4 }}>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{
          fontWeight: 600,
          textAlign: isRtl ? "right" : "left",
          mb: 2,
        }}
      >
        {t("home.upcomingEvents")}
      </Typography>

      <Slider {...settings}>
        {events.map((event) => (
          <div key={event._id}>
            <Paper
              elevation={3}
              sx={{
                position: "relative",
                height: { xs: "250px", sm: "350px", md: "450px" },
                overflow: "hidden",
                borderRadius: 2,
              }}
            >
              <Box
                component="img"
                src={event.image}
                alt={event.name}
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />

              <Box
                sx={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  p: { xs: 2, sm: 3 },
                  background: "linear-gradient(transparent, rgba(0,0,0,0.8))",
                  color: "white",
                  textAlign: isRtl ? "right" : "left",
                }}
              >
                <Typography
                  variant="h4"
                  component="h2"
                  sx={{
                    fontWeight: "bold",
                    textShadow: "1px 1px 3px rgba(0,0,0,0.7)",
                    mb: 1,
                  }}
                >
                  {event.name}
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    justifyContent: "space-between",
                    alignItems: { xs: "flex-start", sm: "center" },
                    gap: 2,
                  }}
                >
                  <Box>
                    <Typography variant="body1" sx={{ mb: 0.5 }}>
                      <strong>{t("home.venue")}:</strong> {event.venue}
                    </Typography>
                    <Typography variant="body1">
                      <strong>{t("home.date")}:</strong>{" "}
                      {formatDate(event.date)}
                    </Typography>
                  </Box>

                  <Button
                    variant="contained"
                    component={Link}
                    to={`/events/${event._id}`}
                    sx={{
                      mt: { xs: 1, sm: 0 },
                      px: 3,
                      py: 1,
                      fontWeight: "bold",
                      backgroundColor: "secondary.main",
                      "&:hover": {
                        backgroundColor: "secondary.dark",
                      },
                    }}
                  >
                    {t("home.bookNow")}
                  </Button>
                </Box>
              </Box>
            </Paper>
          </div>
        ))}
      </Slider>
    </Container>
  );
};

export default EventSlider;
