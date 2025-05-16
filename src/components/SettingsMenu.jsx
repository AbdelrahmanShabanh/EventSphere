import { useState, useContext } from "react";
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Switch,
  Typography,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import TranslateIcon from "@mui/icons-material/Translate";
import { SettingsContext } from "../context/SettingsContext";
import { useTranslation } from "react-i18next";

const SettingsMenu = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const { darkMode, toggleDarkMode, language, changeLanguage } =
    useContext(SettingsContext);
  const { t } = useTranslation();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLanguageChange = (lang) => {
    changeLanguage(lang);
    handleClose();
  };

  return (
    <>
      <IconButton
        color="inherit"
        aria-label="settings"
        onClick={handleClick}
        size="large"
      >
        <SettingsIcon />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          elevation: 3,
          sx: { minWidth: 200 },
        }}
      >
        <MenuItem>
          <ListItemIcon>
            {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
          </ListItemIcon>
          <ListItemText primary={t("settings.theme")} />
          <Switch
            edge="end"
            checked={darkMode}
            onChange={toggleDarkMode}
            inputProps={{ "aria-labelledby": "theme-switch" }}
          />
        </MenuItem>

        <Divider />

        <MenuItem disabled>
          <ListItemIcon>
            <TranslateIcon />
          </ListItemIcon>
          <ListItemText primary={t("settings.language")} />
        </MenuItem>

        <MenuItem
          onClick={() => handleLanguageChange("en")}
          selected={language === "en"}
        >
          <ListItemText inset primary={t("settings.english")} />
        </MenuItem>

        <MenuItem
          onClick={() => handleLanguageChange("ar")}
          selected={language === "ar"}
        >
          <ListItemText inset primary={t("settings.arabic")} />
        </MenuItem>
      </Menu>
    </>
  );
};

export default SettingsMenu;
