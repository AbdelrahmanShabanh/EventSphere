import { useState, useContext } from "react";
import {
  Paper,
  InputBase,
  IconButton,
  Box,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import { useTranslation } from "react-i18next";
import { SettingsContext } from "../context/SettingsContext";

const SearchBar = ({ onSearch, categories = [] }) => {
  const { t } = useTranslation();
  const { isRtl } = useContext(SettingsContext);

  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [category, setCategory] = useState("");

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    onSearch({ searchTerm, category });
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <Box sx={{ width: "100%", mb: 4 }}>
      <Paper
        component="form"
        onSubmit={handleSearch}
        elevation={2}
        sx={{
          p: "2px 4px",
          display: "flex",
          alignItems: "center",
          width: "100%",
          borderRadius: 2,
          flexDirection: isRtl ? "row-reverse" : "row",
        }}
      >
        <InputBase
          sx={{
            ml: isRtl ? 0 : 1,
            mr: isRtl ? 1 : 0,
            flex: 1,
            "& .MuiInputBase-input": {
              textAlign: isRtl ? "right" : "left",
            },
          }}
          placeholder={t("search.placeholder")}
          inputProps={{ "aria-label": t("search.placeholder") }}
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);

            if (window.searchTimeout) clearTimeout(window.searchTimeout);
            window.searchTimeout = setTimeout(() => handleSearch(), 300);
          }}
        />

        <Tooltip title={t("search.searchBy")}>
          <IconButton
            sx={{ p: "10px" }}
            aria-label="filters"
            onClick={toggleFilters}
            color={showFilters ? "primary" : "default"}
          >
            <FilterListIcon />
          </IconButton>
        </Tooltip>

        <IconButton
          type="submit"
          sx={{
            p: "10px",
            bgcolor: "primary.main",
            color: "white",
            "&:hover": {
              bgcolor: "primary.dark",
            },
            borderRadius: isRtl ? "8px 0 0 8px" : "0 8px 8px 0",
          }}
          aria-label="search"
        >
          <SearchIcon />
        </IconButton>
      </Paper>

      {showFilters && (
        <Paper
          elevation={1}
          sx={{
            mt: 1,
            p: 2,
            borderRadius: 2,
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
            alignItems: "center",
          }}
        >
          <FormControl fullWidth size="small">
            <InputLabel id="category-select-label">
              {t("home.category")}
            </InputLabel>
            <Select
              labelId="category-select-label"
              id="category-select"
              value={category}
              label={t("home.category")}
              onChange={(e) => {
                const newCategory = e.target.value;
                setCategory(newCategory);

                setTimeout(() => handleSearch(), 0);
              }}
            >
              <MenuItem value="">{t("search.allCategories")}</MenuItem>
              {categories.map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {cat}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Paper>
      )}
    </Box>
  );
};

export default SearchBar;
