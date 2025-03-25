import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
  Box,
  Pagination,
  Avatar,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { motion } from "framer-motion";
import { FaMapMarkerAlt, FaLink } from "react-icons/fa";

// Variants cho hiệu ứng động
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, staggerChildren: 0.1 },
  },
  hover: {
    scale: 1.05,
    boxShadow: "0px 10px 30px rgba(255, 111, 97, 0.2)", // Bóng mờ cam san hô
    transition: { duration: 0.3 },
  },
};

function SuppliersPage() {
  const [suppliers, setSuppliers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredSuppliers, setFilteredSuppliers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // Gọi API để lấy dữ liệu
  useEffect(() => {
    const fetchData = async () => {
      try {
        const suppliersResponse = await axios.get(
          "http://103.179.185.149:8435/api/Supplier/Suppliers"
        );
        setSuppliers(suppliersResponse.data);
        setFilteredSuppliers(suppliersResponse.data);

        const categoriesResponse = await axios.get(
          "http://103.179.185.149:8435/api/Supplier/SpCategories"
        );
        setCategories(categoriesResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Xử lý tìm kiếm theo Location
  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    setCurrentPage(1);

    const filtered = suppliers.filter((supplier) =>
      supplier.location?.toLowerCase().includes(term)
    );
    setFilteredSuppliers(
      selectedCategory
        ? filtered.filter(
            (supplier) => supplier.supplierCateName === selectedCategory
          )
        : filtered
    );
  };

  // Xử lý lọc theo SupplierCategory
  const handleCategoryChange = (event) => {
    const category = event.target.value;
    setSelectedCategory(category);
    setCurrentPage(1);

    const filtered = suppliers.filter((supplier) =>
      category ? supplier.supplierCateName === category : true
    );
    setFilteredSuppliers(
      searchTerm
        ? filtered.filter((supplier) =>
            supplier.location?.toLowerCase().includes(searchTerm)
          )
        : filtered
    );
  };

  // Xử lý phân trang
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  // Tính toán dữ liệu hiển thị trên trang hiện tại
  const totalItems = filteredSuppliers.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentSuppliers = filteredSuppliers.slice(startIndex, endIndex);

  // Hàm cắt ngắn văn bản
  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "#FFFFFF", // Nền trắng
        py: 6,
        position: "relative",
        overflow: "hidden",
        "&:before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background:
            "linear-gradient(135deg, rgba(255, 111, 97, 0.05) 0%, rgba(255, 215, 0, 0.05) 100%)", // Gradient nhẹ để tạo chiều sâu
          zIndex: 0,
        },
      }}
    >
      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        {/* Header: Thanh tìm kiếm và bộ lọc */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 6,
              flexWrap: "wrap",
              gap: 2,
              background: "#F5F5F5", // Nền xám nhạt
              borderRadius: "20px",
              p: 3,
              boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)", // Bóng mờ nhẹ
              border: "1px solid rgba(255, 111, 97, 0.3)", // Viền cam san hô nhạt
            }}
          >
            <TextField
              label="Search by Location"
              variant="outlined"
              value={searchTerm}
              onChange={handleSearch}
              sx={{
                flex: 1,
                minWidth: 300,
                background: "#FFFFFF", // Nền trắng cho TextField
                borderRadius: "12px",
                "& .MuiOutlinedInput-root": {
                  color: "#333", // Chữ đen
                  "& fieldset": {
                    borderColor: "rgba(255, 111, 97, 0.3)", // Viền cam san hô nhạt
                  },
                  "&:hover fieldset": {
                    borderColor: "#FF6F61", // Cam san hô khi hover
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#FF6F61", // Cam san hô khi focus
                  },
                },
                "& .MuiInputLabel-root": {
                  color: "#666", // Nhãn xám
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "#FF6F61", // Nhãn cam san hô khi focus
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "#666" }} /> {/* Biểu tượng xám */}
                  </InputAdornment>
                ),
              }}
            />
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel sx={{ color: "#666" }}>Filter by Category</InputLabel>
              <Select
                value={selectedCategory}
                onChange={handleCategoryChange}
                label="Filter by Category"
                sx={{
                  background: "#FFFFFF", // Nền trắng
                  borderRadius: "12px",
                  color: "#333", // Chữ đen
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(255, 111, 97, 0.3)", // Viền cam san hô nhạt
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#FF6F61", // Cam san hô khi hover
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#FF6F61", // Cam san hô khi focus
                  },
                  "& .MuiSvgIcon-root": {
                    color: "#666", // Biểu tượng xám
                  },
                }}
              >
                <MenuItem value="">All Categories</MenuItem>
                {categories.map((category) => (
                  <MenuItem
                    key={category.supplierCategoryId}
                    value={category.supplierCategoryName}
                  >
                    {category.supplierCategoryName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </motion.div>

        {/* Danh sách nhà cung cấp dưới dạng thẻ */}
        <Grid container spacing={3}>
          {currentSuppliers.length > 0 ? (
            currentSuppliers.map((supplier, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <motion.div
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                  style={{
                    borderRadius: "20px",
                    overflow: "hidden",
                  }}
                >
                  <Card
                    sx={{
                      background: "#FFFFFF", // Nền trắng
                      borderRadius: "20px",
                      border: "1px solid rgba(255, 111, 97, 0.3)", // Viền cam san hô nhạt
                      color: "#333", // Chữ đen
                      position: "relative",
                      overflow: "hidden",
                      height: "280px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)", // Bóng mờ nhẹ
                      "&:before": {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        background:
                          "linear-gradient(135deg, rgba(255, 111, 97, 0.1), rgba(255, 215, 0, 0.1))", // Gradient nhẹ
                        zIndex: 0,
                        borderRadius: "20px",
                      },
                    }}
                  >
                    <CardContent
                      sx={{ position: "relative", zIndex: 1, flexGrow: 1 }}
                    >
                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 2 }}
                      >
                        <Avatar
                          sx={{
                            bgcolor: "#FF6F61", // Cam san hô
                            mr: 2,
                            width: 48,
                            height: 48,
                            boxShadow: "0 0 10px rgba(255, 111, 97, 0.5)",
                          }}
                        >
                          {supplier.supplierName.charAt(0)}
                        </Avatar>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: "bold",
                            background:
                              "linear-gradient(90deg, #FF6F61, #FFD700)", // Gradient cam san hô và vàng ánh kim
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            maxWidth: "200px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {truncateText(supplier.supplierName, 20)}
                        </Typography>
                      </Box>
                      <Typography
                        variant="body2"
                        sx={{
                          mb: 1,
                          display: "flex",
                          alignItems: "center",
                          maxWidth: "100%",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          color: "#666", // Chữ xám
                        }}
                      >
                        <FaMapMarkerAlt
                          style={{ marginRight: 8, color: "#FF6F61" }}
                        />{" "}
                        {/* Biểu tượng cam san hô */}
                        <strong>Location:</strong>{" "}
                        {truncateText(supplier.location || "N/A", 25)}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          maxWidth: "100%",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          color: "#666", // Chữ xám
                        }}
                      >
                        <strong>Category:</strong> {supplier.supplierCateName}
                      </Typography>
                    </CardContent>
                    <CardActions
                      sx={{
                        justifyContent: "center",
                        pb: 2,
                        position: "relative",
                        zIndex: 1,
                      }}
                    >
                      <Button
                        variant="contained"
                        onClick={() => window.open(supplier.link, "_blank")}
                        sx={{
                          background:
                            "linear-gradient(90deg, #FF6F61, #FFD700)", // Gradient cam san hô và vàng ánh kim
                          color: "#fff",
                          borderRadius: "20px",
                          px: 3,
                          py: 1,
                          "&:hover": {
                            background:
                              "linear-gradient(90deg, #FFD700, #FF6F61)",
                            boxShadow: "0 0 15px rgba(255, 111, 97, 0.5)",
                          },
                        }}
                        startIcon={<FaLink />}
                      >
                        Visit Link
                      </Button>
                    </CardActions>
                  </Card>
                </motion.div>
              </Grid>
            ))
          ) : (
            <Typography
              variant="h6"
              sx={{ textAlign: "center", width: "100%", mt: 4, color: "#333" }} // Chữ đen
            >
              No suppliers found.
            </Typography>
          )}
        </Grid>

        {/* Phân trang */}
        {totalItems > itemsPerPage && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              sx={{
                "& .MuiPaginationItem-root": {
                  color: "#333", // Chữ đen
                  background: "#F5F5F5", // Nền xám nhạt
                  "&:hover": {
                    background: "rgba(255, 111, 97, 0.2)", // Nền cam san hô nhạt khi hover
                  },
                },
                "& .Mui-selected": {
                  background: "linear-gradient(90deg, #FF6F61, #FFD700)", // Gradient cam san hô và vàng ánh kim
                  color: "#fff",
                  "&:hover": {
                    background: "linear-gradient(90deg, #FFD700, #FF6F61)",
                  },
                },
              }}
            />
          </Box>
        )}
      </Container>
    </Box>
  );
}

export default SuppliersPage;
