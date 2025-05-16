import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  useScrollTrigger,
  Slide,
  Container,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Divider,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { AuthContext } from "../context/AuthContext";
import { SettingsContext } from "../context/SettingsContext";
import SettingsMenu from "./SettingsMenu";
import { useTranslation } from "react-i18next";

function HideOnScroll(props) {
  const { children } = props;
  const trigger = useScrollTrigger();

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const authCtx = useContext(AuthContext);
  const { isRtl } = useContext(SettingsContext);
  const nav = useNavigate();
  const { t } = useTranslation();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavigation = (path) => {
    setMobileOpen(false);
    if (path) nav(path);
  };

  function logUserOut() {
    authCtx.logout();
    handleNavigation("/login");
  }

  const showAdminStuff = authCtx.user && authCtx.isAdmin();
  const drawerContent = (
    <Box
      sx={{
        width: 250,
        height: "100%",
        bgcolor: "background.paper",
        display: "flex",
        flexDirection: "column",
      }}
      role="presentation"
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          p: 2,
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <Box
            component="img"
            src="/logo.svg"
            alt="EventSphere Logo"
            sx={{
              height: 28,
              width: 28,
              mr: 1,
            }}
          />
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              textDecoration: "none",
              color: "text.primary",
              fontWeight: "bold",
            }}
            onClick={() => setMobileOpen(false)}
          >
            EventSphere
          </Typography>
        </Box>
        <IconButton onClick={() => setMobileOpen(false)}>
          <CloseIcon />
        </IconButton>
      </Box>

      <List sx={{ flexGrow: 1 }}>
        <ListItemButton
          component={Link}
          to="/"
          onClick={() => setMobileOpen(false)}
        >
          <ListItemText primary={t("navbar.events")} />
        </ListItemButton>

        {authCtx.user && (
          <>
            <ListItemButton
              component={Link}
              to="/bookings"
              onClick={() => setMobileOpen(false)}
            >
              <ListItemText primary={t("navbar.myBookings")} />
            </ListItemButton>

            {showAdminStuff && (
              <ListItemButton
                component={Link}
                to="/admin"
                onClick={() => setMobileOpen(false)}
                sx={{ bgcolor: "action.selected" }}
              >
                <ListItemText primary={t("navbar.admin")} />
              </ListItemButton>
            )}

            <ListItemButton onClick={logUserOut}>
              <ListItemText primary={t("navbar.logout")} />
            </ListItemButton>
          </>
        )}

        {!authCtx.user && (
          <>
            <ListItemButton
              component={Link}
              to="/login"
              onClick={() => setMobileOpen(false)}
            >
              <ListItemText primary={t("navbar.login")} />
            </ListItemButton>

            <ListItemButton
              component={Link}
              to="/register"
              onClick={() => setMobileOpen(false)}
              sx={{
                bgcolor: "primary.main",
                color: "primary.contrastText",
                "&:hover": {
                  bgcolor: "primary.dark",
                },
              }}
            >
              <ListItemText primary={t("navbar.register")} />
            </ListItemButton>
          </>
        )}
      </List>
    </Box>
  );

  return (
    <HideOnScroll>
      <AppBar
        position="sticky"
        elevation={2}
        sx={{
          mb: 0,
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Container maxWidth="lg">
          <Toolbar disableGutters>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                flexGrow: 1,
              }}
            >
              <Box
                component="img"
                src="/logo.svg"
                alt="EventSphere Logo"
                sx={{
                  height: { xs: 32, sm: 40 },
                  width: { xs: 32, sm: 40 },
                  mr: 1,
                }}
              />
              <Typography
                variant="h6"
                component={Link}
                to="/"
                sx={{
                  textDecoration: "none",
                  color: "#fff",
                  fontWeight: "bold",
                  fontSize: { xs: "1.1rem", sm: "1.25rem" },
                }}
              >
                EventSphere
              </Typography>
            </Box>

            {!isMobile && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  flexDirection: isRtl ? "row-reverse" : "row",
                }}
              >
                {authCtx.user ? (
                  <>
                    <Button
                      color="inherit"
                      component={Link}
                      to="/"
                      sx={{ mx: 0.5 }}
                    >
                      {t("navbar.events")}
                    </Button>

                    <Button
                      color="inherit"
                      component={Link}
                      to="/bookings"
                      sx={{ mx: 0.5 }}
                    >
                      {t("navbar.myBookings")}
                    </Button>

                    {showAdminStuff && (
                      <Button
                        color="inherit"
                        component={Link}
                        to="/admin"
                        sx={{
                          mx: 0.5,
                          backgroundColor: "rgba(255,255,255,0.1)",
                          "&:hover": {
                            backgroundColor: "rgba(255,255,255,0.2)",
                          },
                        }}
                      >
                        {t("navbar.admin")}
                      </Button>
                    )}

                    <Button
                      color="inherit"
                      onClick={logUserOut}
                      sx={{ mx: 0.5 }}
                    >
                      {t("navbar.logout")}
                    </Button>
                  </>
                ) : (
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Button
                      color="inherit"
                      component={Link}
                      to="/login"
                      sx={{ mx: 0.5 }}
                    >
                      {t("navbar.login")}
                    </Button>

                    <Button
                      variant="outlined"
                      color="inherit"
                      component={Link}
                      to="/register"
                      sx={{
                        mx: 0.5,
                        borderColor: "rgba(255,255,255,0.5)",
                        "&:hover": {
                          borderColor: "white",
                          backgroundColor: "rgba(255,255,255,0.1)",
                        },
                      }}
                    >
                      {t("navbar.register")}
                    </Button>
                  </Box>
                )}

                <SettingsMenu />
              </Box>
            )}

            {isMobile && (
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <SettingsMenu />
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  edge="end"
                  onClick={handleDrawerToggle}
                  sx={{ ml: 1 }}
                >
                  <MenuIcon />
                </IconButton>
              </Box>
            )}
          </Toolbar>
        </Container>

        <Drawer
          anchor={isRtl ? "right" : "left"}
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: 280,
              direction: isRtl ? "rtl" : "ltr",
            },
          }}
        >
          {drawerContent}
        </Drawer>
      </AppBar>
    </HideOnScroll>
  );
}

export default Navbar;
