import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import CardCategory from "../../../features/Dashboard/Menu/CardCategory";
import CardMenu from "../../../features/Dashboard/Menu/CardMenu";
import axiosInstance from "../../../config/axios/axiosInstance";
import { useQuery } from "react-query";
import CartMenuOrder from "../../../features/Dashboard/Menu/CartMenuOrder";
import { toast } from "react-toastify";

export default function MenuPage() {
  //cart
  const [cart, setCart] = useState(() => {
    // Inisialisasi state dengan data dari localStorage jika ada
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    return savedCart;
  });

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item, quantity) => {
    const existingItem = cart.find((cartItem) => cartItem._id === item._id);
    if (existingItem) {
      const updatedCart = cart.map((cartItem) =>
        cartItem._id === item._id ? { ...cartItem, quantity: cartItem.quantity + quantity } : cartItem
      );
      setCart(updatedCart);
    } else {
      setCart([...cart, { ...item, quantity }]);
    }
  };

  const updateQuantity = (itemId, newQuantity) => {
    const updatedCart = cart.map((cartItem) =>
      cartItem._id === itemId ? { ...cartItem, quantity: newQuantity } : cartItem
    );
    setCart(updatedCart);
  };

  const removeFromCart = (itemId) => {
    const updatedCart = cart.filter((cartItem) => cartItem._id !== itemId);
    setCart(updatedCart);
    toast.success("Success deleted menu to cart ");
  };

  //fetch counts
  const fetchCategories = async (page = 1) => {
    const res = await axiosInstance.get(`/api/v1/category/get?page=${page}`);
    return res.data;
  };

  const fetchMenuCountByCategory = async (categoryId) => {
    const res = await axiosInstance.get(`/api/v1/menu/count/category/${categoryId}`);
    return res.data.count;
  };

  //get category
  const {
    data: categoriesData,
    isLoading: loadingCategories,
    error: errorCategories,
  } = useQuery(["categories"], () => fetchCategories(), {
    keepPreviousData: true,
  });

  const { data: menuCounts, isLoading: loadingMenuCounts } = useQuery(
    ["menuCounts", categoriesData?.category],
    () => {
      if (categoriesData?.category) {
        return Promise.all(categoriesData.category.map((category) => fetchMenuCountByCategory(category._id)));
      }
      return [];
    },
    {
      enabled: !!categoriesData?.category, // Hanya jalankan query ini jika categories sudah ada
    }
  );

  const [selectedCategory, setSelectedCategory] = useState(categoriesData?.category[0]._id);

  //get menu
  const fetchMenu = async (categoryId, page = 1) => {
    const res = await axiosInstance.get(`/api/v1/menu/getby?categoryId=${categoryId}&page=${page}`);
    return res.data;
  };

  const [currentPage, setCurrentPage] = useState(1);
  const {
    data: dataMenu,
    isLoading: loadingMenu,
    error: errorMenu,
  } = useQuery(["menus", selectedCategory, currentPage], () => fetchMenu(selectedCategory, currentPage), {
    keepPreviousData: true,
    enabled: !!selectedCategory, // Hanya jalankan query jika selectedCategory ada
  });

  //modal order

  // submit order
  const submitOrder = async () => {
    try {
      const response = await axiosInstance.post("/api/v1/order/create", {
        cart: cart,
      });

      if (response.status === 200) {
        toast.success("Order submitted successfully!");
        setCart([]); // Kosongkan keranjang setelah berhasil mengirim
      } else {
        toast.error("Failed to submit order.");
      }
    } catch (error) {
      toast.error("An error occurred while submitting the order.");
    }
  };

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1); // Reset halaman ke 1 saat kategori berubah
  };

  return (
    <>
      <Row>
        <Col xl={"8"}>
          <Row>
            <CardCategory
              categories={categoriesData}
              handleCategoryClick={handleCategoryClick}
              selectedCategory={selectedCategory}
              menuCounts={menuCounts}
            />
          </Row>
          <Row>
            {dataMenu?.menu?.map((m) => (
              <CardMenu
                key={m._id}
                title={m.title}
                image={m.imgUrl}
                desc={m.desc}
                price={m.price}
                addToCart={(quantity) => addToCart(m, quantity)}
              />
            ))}
          </Row>
        </Col>
        <Col xl={"4"}>
          <CartMenuOrder
            cart={cart}
            removeFromCart={removeFromCart}
            updateQuantity={updateQuantity}
            addToCart={addToCart}
            submitOrder={submitOrder}
            setCart={setCart}
          />
        </Col>
      </Row>
    </>
  );
}
