-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: 08 يوليو 2026 الساعة 23:09
-- إصدار الخادم: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `myrestaurant`
--

-- --------------------------------------------------------

--
-- بنية الجدول `activity_logs`
--

CREATE TABLE `activity_logs` (
  `id` int(11) NOT NULL,
  `admin_id` int(11) DEFAULT NULL,
  `action` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- بنية الجدول `addons`
--

CREATE TABLE `addons` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `name_ar` varchar(100) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `emoji` varchar(10) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- إرجاع أو استيراد بيانات الجدول `addons`
--

INSERT INTO `addons` (`id`, `name`, `name_ar`, `price`, `emoji`, `is_active`) VALUES
(1, 'Extra Cheese', 'جبنة إضافية', 1.50, '🧀', 1),
(2, 'Extra Sauce', 'صلصة إضافية', 1.00, '🍅', 1),
(3, 'Extra Wasabi', 'واسابي إضافي', 0.50, '🟢', 1),
(4, 'Pickled Ginger', 'زنجبيل مخلل', 0.70, '🫚', 1),
(5, 'Whipped Cream', 'كريمة مخفوقة', 1.00, '🍦', 1);

-- --------------------------------------------------------

--
-- بنية الجدول `admin_users`
--

CREATE TABLE `admin_users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) DEFAULT NULL,
  `password_hash` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- إرجاع أو استيراد بيانات الجدول `admin_users`
--

INSERT INTO `admin_users` (`id`, `username`, `password_hash`, `created_at`) VALUES
(1, 'admin', '$2a$10$HASH_HERE', '2026-06-22 18:25:13');

-- --------------------------------------------------------

--
-- بنية الجدول `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `name_ar` varchar(100) NOT NULL,
  `icon` varchar(50) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `display_order` int(11) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- إرجاع أو استيراد بيانات الجدول `categories`
--

INSERT INTO `categories` (`id`, `name`, `name_ar`, `icon`, `image`, `display_order`, `is_active`, `created_at`) VALUES
(11, 'Japanese Kitchen', 'المطبخ الياباني', '🍣', 'https://images.unsplash.com/photo-1553621042-f6e147245754', 1, 1, '2026-07-02 15:41:28'),
(12, 'Chinese Kitchen', 'المطبخ الصيني', '🥢', 'https://images.unsplash.com/photo-1604908177522-0402b0e3d6c8', 1, 1, '2026-07-02 15:41:28'),
(13, 'Korean Kitchen', 'المطبخ الكوري', '🇰🇷', 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56', 1, 1, '2026-07-02 15:41:28'),
(14, 'Italian Kitchen', 'المطبخ الإيطالي', '🍕', 'https://images.unsplash.com/photo-1601924582970-9238bcb495d7', 1, 1, '2026-07-02 15:41:28'),
(15, 'Seafood', 'المأكولات البحرية', '🦐', 'https://images.unsplash.com/photo-1600891964092-4316c288032e', 1, 1, '2026-07-02 15:41:28'),
(16, 'Asian Specials', 'أطباق آسيوية مميزة', '🍜', 'https://images.unsplash.com/photo-1562967916-eb82221dfb92', 1, 1, '2026-07-02 15:41:28'),
(17, 'Healthy Choices', 'خيارات صحية', '🥗', 'https://images.unsplash.com/photo-1540420773420-3366772f4999', 1, 1, '2026-07-02 15:41:28'),
(18, 'Drinks', 'مشروبات', '🍹', 'https://images.unsplash.com/photo-1551024709-8f23befc6f87', 1, 1, '2026-07-02 15:41:28'),
(20, 'Desserts', 'حلويات', '🍰', 'https://images.unsplash.com/photo-1551024506-0bccd828d307', 9, 1, '2026-07-03 10:29:26');

-- --------------------------------------------------------

--
-- بنية الجدول `category_addons`
--

CREATE TABLE `category_addons` (
  `id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL,
  `addon_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- إرجاع أو استيراد بيانات الجدول `category_addons`
--

INSERT INTO `category_addons` (`id`, `category_id`, `addon_id`) VALUES
(13, 15, 3),
(14, 15, 4),
(15, 18, 5),
(16, 18, 1);

-- --------------------------------------------------------

--
-- بنية الجدول `offers`
--

CREATE TABLE `offers` (
  `id` int(11) NOT NULL,
  `title` varchar(200) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `discount_percent` int(11) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `start_date` datetime DEFAULT NULL,
  `end_date` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `old_price` decimal(10,2) NOT NULL,
  `new_price` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- إرجاع أو استيراد بيانات الجدول `offers`
--

INSERT INTO `offers` (`id`, `title`, `description`, `image`, `discount_percent`, `is_active`, `start_date`, `end_date`, `created_at`, `old_price`, `new_price`) VALUES
(1, 'Burger Combo', 'Large Burger + Fries', 'burger.png', 25, 1, '2026-07-08 00:00:00', '2026-07-20 00:00:00', '2026-07-08 20:30:40', 0.00, 0.00),
(2, 'p', 'a', 's', 0, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00', '2026-07-08 20:56:49', 0.00, 0.00),
(3, 'p', 'a', 's', 0, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00', '2026-07-08 20:57:32', 0.00, 0.00),
(4, 'pasta Combo', 'Large Burger + Fries', 'burger.png', 25, 1, '2026-07-08 00:00:00', '2026-07-20 00:00:00', '2026-07-08 21:00:36', 20.00, 15.00);

-- --------------------------------------------------------

--
-- بنية الجدول `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `table_id` int(11) DEFAULT NULL,
  `status` enum('pending','preparing','ready','completed','cancelled') DEFAULT 'pending',
  `total_price` decimal(10,2) DEFAULT 0.00,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- إرجاع أو استيراد بيانات الجدول `orders`
--

INSERT INTO `orders` (`id`, `table_id`, `status`, `total_price`, `created_at`) VALUES
(1, 1, 'pending', 25.98, '2026-07-06 21:48:58'),
(2, 1, 'pending', 25.98, '2026-07-06 21:52:18'),
(3, 1, 'pending', 12.99, '2026-07-06 22:04:56'),
(4, 1, 'pending', 10.00, '2026-07-06 22:05:32');

-- --------------------------------------------------------

--
-- بنية الجدول `order_addons`
--

CREATE TABLE `order_addons` (
  `id` int(11) NOT NULL,
  `order_item_id` int(11) DEFAULT NULL,
  `addon_id` int(11) DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- إرجاع أو استيراد بيانات الجدول `order_addons`
--

INSERT INTO `order_addons` (`id`, `order_item_id`, `addon_id`, `price`) VALUES
(1, 1, 1, 2.00);

-- --------------------------------------------------------

--
-- بنية الجدول `order_items`
--

CREATE TABLE `order_items` (
  `id` int(11) NOT NULL,
  `order_id` int(11) DEFAULT NULL,
  `product_id` int(11) DEFAULT NULL,
  `quantity` int(11) DEFAULT 1,
  `price` decimal(10,2) DEFAULT NULL,
  `note` text DEFAULT NULL,
  `selected_size` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- إرجاع أو استيراد بيانات الجدول `order_items`
--

INSERT INTO `order_items` (`id`, `order_id`, `product_id`, `quantity`, `price`, `note`, `selected_size`) VALUES
(1, 2, 40, 2, 12.99, 'no cheese', 'M'),
(2, 3, 36, 1, 12.99, '', NULL),
(3, 4, 35, 1, 10.00, '', NULL);

-- --------------------------------------------------------

--
-- بنية الجدول `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL,
  `name` varchar(200) NOT NULL,
  `name_ar` varchar(200) NOT NULL,
  `description` text DEFAULT NULL,
  `description_ar` text DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `rating` decimal(3,2) DEFAULT 0.00,
  `is_available` tinyint(1) DEFAULT 1,
  `is_featured` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `calories` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- إرجاع أو استيراد بيانات الجدول `products`
--

INSERT INTO `products` (`id`, `category_id`, `name`, `name_ar`, `description`, `description_ar`, `price`, `image`, `rating`, `is_available`, `is_featured`, `created_at`, `calories`) VALUES
(34, 11, 'Pizza', 'بيتزا', 'Cheese pizza', 'بيتزا جبنة', 10.00, 'pizza.jpg', 0.00, 1, 0, '2026-07-02 15:54:46', 0),
(35, 11, 'Test', 'اختبار', 'Test', 'اختبار', 10.00, 'new.jpg', 0.00, 1, 0, '2026-07-02 15:54:46', 0),
(36, 11, 'Dragon Roll', 'دراجون رول', 'Sushi with salmon and avocado', 'سوشي سلمون وأفوكادو', 12.99, 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&auto=format&fit=crop', 4.90, 1, 1, '2026-07-02 15:54:46', 450),
(37, 11, 'Spicy Ramen', 'رامن حار', 'Japanese spicy noodles', 'نودلز يابانية حارة', 10.99, 'https://images.unsplash.com/photo-1555126634-323283e090fa?w=800&auto=format&fit=crop', 4.80, 1, 1, '2026-07-02 15:54:46', 600),
(38, 12, 'Kung Pao Chicken', 'دجاج كونغ باو', 'Chinese spicy chicken', 'دجاج صيني حار', 9.99, 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=800&auto=format&fit=crop', 4.70, 1, 0, '2026-07-02 15:54:46', 520),
(39, 13, 'Korean Fried Chicken', 'دجاج كوري مقلي', 'Crispy spicy chicken', 'دجاج مقرمش حار', 11.50, 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop', 4.80, 1, 1, '2026-07-02 15:54:46', 700),
(40, 14, 'Margherita Pizza', 'بيتزا مارجريتا', 'Classic pizza', 'بيتزا كلاسيك', 8.99, 'https://images.unsplash.com/photo-1601924582970-93f6c9d3b2a0?w=800&auto=format&fit=crop', 4.60, 1, 1, '2026-07-02 15:54:46', 800),
(41, 15, 'Grilled Salmon', 'سلمون مشوي', 'Healthy grilled fish', 'سمك مشوي صحي', 13.99, 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&auto=format&fit=crop', 4.90, 1, 1, '2026-07-02 15:54:46', 400),
(42, 16, 'Avocado Salad', 'سلطة أفوكادو', 'Fresh healthy salad', 'سلطة صحية طازجة', 7.50, 'https://images.unsplash.com/photo-1551248429-40975c4b4a2b?w=800&auto=format&fit=crop', 4.50, 1, 0, '2026-07-02 15:54:46', 250),
(43, 17, 'Mango Smoothie', 'سموذي مانجو', 'Cold mango drink', 'مشروب مانجو بارد', 5.99, 'https://images.unsplash.com/photo-1553530666-ba11a5f7e7f7?w=800&auto=format&fit=crop', 4.70, 1, 1, '2026-07-02 15:54:46', 300),
(44, 18, 'Chocolate Cake', 'كيك شوكولا', 'Rich chocolate dessert', 'كيك شوكولا غني', 6.99, 'https://images.unsplash.com/photo-1578985545062-69f3b4c2d3a1?w=800&auto=format&fit=crop', 4.80, 1, 1, '2026-07-02 15:54:46', 650),
(50, 11, 'Sushi Roll', 'رول سوشي', 'Fresh sushi roll', 'رول سوشي طازج', 8.99, 'https://images.unsplash.com/photo-1553621042-f6e147245754', 4.50, 1, 1, '2026-07-04 17:02:19', 300),
(51, 11, 'Ramen', 'رامن', 'Japanese noodle soup', 'شوربة نودلز يابانية', 10.99, 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624', 4.70, 1, 1, '2026-07-04 17:02:19', 500),
(52, 11, 'Tempura', 'تمبورا', 'Crispy fried shrimp', 'جمبري مقلي مقرمش', 9.50, 'https://images.unsplash.com/photo-1604908177220-8d8e6c6c0f6b', 4.30, 1, 0, '2026-07-04 17:02:19', 450),
(53, 11, 'Miso Soup', 'شوربة ميسو', 'Traditional soup', 'شوربة يابانية تقليدية', 4.99, 'https://images.unsplash.com/photo-1604908554027-7c7c0f6b2f2c', 4.20, 1, 0, '2026-07-04 17:02:19', 120),
(54, 11, 'Teriyaki Chicken', 'دجاج ترياكي', 'Grilled chicken sauce', 'دجاج مشوي بصوص ترياكي', 11.99, 'https://images.unsplash.com/photo-1604908177522-3b9c5d1f0d8e', 4.60, 1, 1, '2026-07-04 17:02:19', 550),
(55, 12, 'Kung Pao Chicken', 'دجاج كونغ باو', 'Spicy chicken', 'دجاج حار', 10.99, 'https://images.unsplash.com/photo-1604908177522-040f0f4c2c2c', 4.50, 1, 1, '2026-07-04 17:06:38', 500),
(56, 12, 'Fried Rice', 'أرز مقلي', 'Chinese fried rice', 'أرز بالخضار', 8.50, 'https://images.unsplash.com/photo-1604908554027-9c7d6f8f6d2d', 4.30, 1, 0, '2026-07-04 17:06:38', 420),
(57, 12, 'Spring Rolls', 'لفائف ربيان', 'Crispy rolls', 'لفائف مقرمشة', 6.99, 'https://images.unsplash.com/photo-1604908177280-1d3b2f0c0a6a', 4.20, 1, 0, '2026-07-04 17:06:38', 300),
(58, 12, 'Sweet & Sour', 'حلو حامض', 'Chicken sauce dish', 'دجاج صوص', 11.20, 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624', 4.60, 1, 0, '2026-07-04 17:06:38', 480),
(59, 12, 'Noodles', 'نودلز', 'Stir fried noodles', 'نودلز صيني', 9.00, 'https://images.unsplash.com/photo-1553621042-f6e147245754', 4.40, 1, 0, '2026-07-04 17:06:38', 410),
(65, 20, 'Chocolate Cake', 'كيك شوكولا', 'Rich chocolate cake', 'كيك شوكولا غني', 6.99, 'https://images.unsplash.com/photo-1578985545062', 4.80, 1, 1, '2026-07-04 17:09:29', 350),
(66, 20, 'Cheesecake', 'تشيز كيك', 'Creamy cheesecake', 'تشيز كيك كريمي', 7.50, 'https://images.unsplash.com/photo-1565958011703', 4.70, 1, 0, '2026-07-04 17:09:29', 400),
(67, 20, 'Brownie', 'براوني', 'Chocolate brownie', 'براوني شوكولا', 5.50, 'https://images.unsplash.com/photo-1606313564200', 4.60, 1, 0, '2026-07-04 17:09:29', 300),
(68, 20, 'Ice Cream', 'آيس كريم', 'Vanilla ice cream', 'آيس كريم فانيلا', 4.99, 'https://images.unsplash.com/photo-1501443762994', 4.50, 1, 0, '2026-07-04 17:09:29', 250),
(69, 20, 'Donut', 'دونات', 'Sweet donut', 'دونات حلوة', 3.99, 'https://images.unsplash.com/photo-1551024601', 4.40, 1, 0, '2026-07-04 17:09:29', 280),
(70, 17, 'Avocado Salad', 'سلطة أفوكادو', 'Fresh healthy salad', 'سلطة صحية طازجة', 7.50, 'https://images.unsplash.com/photo-1551248429', 4.50, 1, 1, '2026-07-04 17:10:52', 250),
(71, 17, 'Quinoa Bowl', 'طبق كينوا', 'Healthy quinoa bowl', 'طبق كينوا صحي', 8.99, 'https://images.unsplash.com/photo-1512621776951', 4.60, 1, 0, '2026-07-04 17:10:52', 320),
(72, 17, 'Grilled Chicken Salad', 'سلطة دجاج مشوي', 'Protein salad', 'سلطة بروتين', 9.50, 'https://images.unsplash.com/photo-1546069901', 4.70, 1, 0, '2026-07-04 17:10:52', 350),
(73, 17, 'Green Smoothie', 'سموذي أخضر', 'Detox drink', 'مشروب ديتوكس', 5.99, 'https://images.unsplash.com/photo-1542444459', 4.40, 1, 0, '2026-07-04 17:10:52', 180),
(74, 17, 'Oat Bowl', 'شوفان', 'Healthy oats breakfast', 'فطور شوفان صحي', 6.50, 'https://images.unsplash.com/photo-1506084868230', 4.30, 1, 0, '2026-07-04 17:10:52', 290),
(75, 14, 'Margherita Pizza', 'بيتزا مارجريتا', 'Classic pizza', 'بيتزا كلاسيكية', 10.99, 'https://images.unsplash.com/photo-1601924582975', 4.80, 1, 1, '2026-07-04 17:11:49', 700),
(76, 14, 'Pepperoni Pizza', 'بيتزا بيبروني', 'Spicy pepperoni pizza', 'بيتزا بيبروني حارة', 12.99, 'https://images.unsplash.com/photo-1628840042765', 4.70, 1, 1, '2026-07-04 17:11:49', 850),
(77, 14, 'Chicken Pizza', 'بيتزا دجاج', 'Chicken toppings pizza', 'بيتزا بالدجاج', 11.99, 'https://images.unsplash.com/photo-1594007654729', 4.60, 1, 0, '2026-07-04 17:11:49', 780),
(78, 14, 'Veggie Pizza', 'بيتزا خضار', 'Vegetarian pizza', 'بيتزا نباتية', 9.99, 'https://images.unsplash.com/photo-1548365328', 4.50, 1, 0, '2026-07-04 17:11:49', 650),
(79, 14, 'Seafood Pizza', 'بيتزا مأكولات بحرية', 'Seafood pizza', 'بيتزا سي فود', 13.99, 'https://images.unsplash.com/photo-1600891964599', 4.60, 1, 0, '2026-07-04 17:11:49', 900),
(81, 14, 'Margherita Pizza', 'بيتزا مارجريتا', 'Classic Italian pizza with cheese', 'بيتزا إيطالية كلاسيكية بالجبن', 12.99, 'https://images.unsplash.com/photo-1601924582970-9238bcb495d9', 4.50, 1, 1, '2026-07-05 22:03:16', 280);

-- --------------------------------------------------------

--
-- بنية الجدول `product_addons`
--

CREATE TABLE `product_addons` (
  `product_id` int(11) NOT NULL,
  `addon_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- بنية الجدول `product_sizes`
--

CREATE TABLE `product_sizes` (
  `id` int(11) NOT NULL,
  `product_id` int(11) DEFAULT NULL,
  `size_name` varchar(10) DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- إرجاع أو استيراد بيانات الجدول `product_sizes`
--

INSERT INTO `product_sizes` (`id`, `product_id`, `size_name`, `price`) VALUES
(7, 81, 'S', 10.00),
(8, 81, 'M', 12.99),
(9, 81, 'L', 15.99),
(10, 40, 'S', 8.99),
(11, 40, 'M', 10.99),
(12, 40, 'L', 12.99),
(13, 75, 'S', 10.99),
(14, 75, 'M', 12.99),
(15, 75, 'L', 15.99),
(16, 81, 'S', 10.00),
(17, 81, 'M', 12.99),
(18, 81, 'L', 15.99);

-- --------------------------------------------------------

--
-- بنية الجدول `settings`
--

CREATE TABLE `settings` (
  `id` int(11) NOT NULL,
  `key_name` varchar(100) DEFAULT NULL,
  `value` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- بنية الجدول `tables`
--

CREATE TABLE `tables` (
  `id` int(11) NOT NULL,
  `table_number` varchar(10) DEFAULT NULL,
  `capacity` int(11) DEFAULT 2,
  `qr_code` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- إرجاع أو استيراد بيانات الجدول `tables`
--

INSERT INTO `tables` (`id`, `table_number`, `capacity`, `qr_code`, `is_active`, `created_at`) VALUES
(1, '1', 4, 'TABLE-001', 1, '2026-07-06 21:31:30'),
(2, '2', 2, 'TABLE-002', 1, '2026-07-06 21:31:30'),
(3, '3', 6, 'TABLE-003', 1, '2026-07-06 21:31:30');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `activity_logs`
--
ALTER TABLE `activity_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `admin_id` (`admin_id`);

--
-- Indexes for table `addons`
--
ALTER TABLE `addons`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `admin_users`
--
ALTER TABLE `admin_users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `category_addons`
--
ALTER TABLE `category_addons`
  ADD PRIMARY KEY (`id`),
  ADD KEY `category_id` (`category_id`),
  ADD KEY `addon_id` (`addon_id`);

--
-- Indexes for table `offers`
--
ALTER TABLE `offers`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `table_id` (`table_id`);

--
-- Indexes for table `order_addons`
--
ALTER TABLE `order_addons`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_item_id` (`order_item_id`),
  ADD KEY `addon_id` (`addon_id`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD KEY `category_id` (`category_id`);

--
-- Indexes for table `product_addons`
--
ALTER TABLE `product_addons`
  ADD PRIMARY KEY (`product_id`,`addon_id`),
  ADD KEY `addon_id` (`addon_id`);

--
-- Indexes for table `product_sizes`
--
ALTER TABLE `product_sizes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `settings`
--
ALTER TABLE `settings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `key_name` (`key_name`);

--
-- Indexes for table `tables`
--
ALTER TABLE `tables`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `table_number` (`table_number`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `activity_logs`
--
ALTER TABLE `activity_logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `addons`
--
ALTER TABLE `addons`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `admin_users`
--
ALTER TABLE `admin_users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `category_addons`
--
ALTER TABLE `category_addons`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `offers`
--
ALTER TABLE `offers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `order_addons`
--
ALTER TABLE `order_addons`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=82;

--
-- AUTO_INCREMENT for table `product_sizes`
--
ALTER TABLE `product_sizes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `settings`
--
ALTER TABLE `settings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tables`
--
ALTER TABLE `tables`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- قيود الجداول المُلقاة.
--

--
-- قيود الجداول `activity_logs`
--
ALTER TABLE `activity_logs`
  ADD CONSTRAINT `activity_logs_ibfk_1` FOREIGN KEY (`admin_id`) REFERENCES `admin_users` (`id`);

--
-- قيود الجداول `category_addons`
--
ALTER TABLE `category_addons`
  ADD CONSTRAINT `category_addons_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`),
  ADD CONSTRAINT `category_addons_ibfk_2` FOREIGN KEY (`addon_id`) REFERENCES `addons` (`id`);

--
-- قيود الجداول `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`table_id`) REFERENCES `tables` (`id`);

--
-- قيود الجداول `order_addons`
--
ALTER TABLE `order_addons`
  ADD CONSTRAINT `order_addons_ibfk_1` FOREIGN KEY (`order_item_id`) REFERENCES `order_items` (`id`),
  ADD CONSTRAINT `order_addons_ibfk_2` FOREIGN KEY (`addon_id`) REFERENCES `addons` (`id`);

--
-- قيود الجداول `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  ADD CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);

--
-- قيود الجداول `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`);

--
-- قيود الجداول `product_addons`
--
ALTER TABLE `product_addons`
  ADD CONSTRAINT `product_addons_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  ADD CONSTRAINT `product_addons_ibfk_2` FOREIGN KEY (`addon_id`) REFERENCES `addons` (`id`);

--
-- قيود الجداول `product_sizes`
--
ALTER TABLE `product_sizes`
  ADD CONSTRAINT `product_sizes_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
