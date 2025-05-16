import {
  Box,
  Container,
  Typography,
  Link,
  Divider,
  IconButton,
} from "@mui/material";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { SettingsContext } from "../context/SettingsContext";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import EmailIcon from "@mui/icons-material/Email";

const Footer = () => {
  const { t } = useTranslation();
  const { isRtl, darkMode } = useContext(SettingsContext);

  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        mt: "auto",
        backgroundColor: darkMode ? "background.paper" : "primary.main",
        color: darkMode ? "text.primary" : "white",
        borderTop: "1px solid",
        borderColor: darkMode ? "divider" : "rgba(255, 255, 255, 0.12)",
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "center", md: "flex-start" },
            textAlign: { xs: "center", md: isRtl ? "right" : "left" },
            gap: 2,
          }}
        >
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <Box
                component="img"
                src="/logo.svg"
                alt="EventSphere Logo"
                sx={{
                  height: 32,
                  width: 32,
                  mr: 1,
                }}
              />
              <Typography variant="h6">EventSphere</Typography>
            </Box>
            <Typography
              variant="body2"
              color={darkMode ? "text.secondary" : "rgba(255, 255, 255, 0.7)"}
            >
              {t("footer.tagline")}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Typography variant="subtitle1" fontWeight="bold">
              {t("footer.connect")}
            </Typography>
            <Box
              sx={{
                display: "flex",
                gap: 1,
                justifyContent: { xs: "center", md: "flex-start" },
              }}
            >
              <IconButton
                size="small"
                aria-label="GitHub"
                component={Link}
                href="github.com/AbdelrahmanShabanh"
                target="_blank"
                sx={{ color: darkMode ? "text.primary" : "white" }}
              >
                <GitHubIcon />
              </IconButton>
              <IconButton
                size="small"
                aria-label="LinkedIn"
                component={Link}
                href="linkedin.com/in/abdelrahman-shaban-8066972b6"
                target="_blank"
                sx={{ color: darkMode ? "text.primary" : "white" }}
              >
                <LinkedInIcon />
              </IconButton>
              <IconButton
                size="small"
                aria-label="Email"
                component={Link}
                href="mailto: bodysh2019@gmail.com"
                sx={{ color: darkMode ? "text.primary" : "white" }}
              >
                <EmailIcon />
              </IconButton>
            </Box>
          </Box>
        </Box>

        <Divider
          sx={{
            my: 2,
            borderColor: darkMode ? "divider" : "rgba(255, 255, 255, 0.12)",
          }}
        />

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: "center",
            textAlign: "center",
            gap: 1,
          }}
        >
          <Typography
            variant="body2"
            color={darkMode ? "text.secondary" : "rgba(255, 255, 255, 0.7)"}
          >
            &copy; {currentYear} {t("footer.copyright")}{" "}
            <strong>Abdelrahman Shaban</strong>
          </Typography>

          <Box
            sx={{
              display: "flex",
              gap: { xs: 1, sm: 2 },
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            <Link href="#" color="inherit" underline="hover" variant="body2">
              {t("footer.terms")}
            </Link>
            <Link href="#" color="inherit" underline="hover" variant="body2">
              {t("footer.privacy")}
            </Link>
            <Link href="#" color="inherit" underline="hover" variant="body2">
              {t("footer.contact")}
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
