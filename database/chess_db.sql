-- phpMyAdmin SQL Dump
-- version 5.2.1deb3
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Maj 06, 2026 at 03:43 AM
-- Wersja serwera: 8.0.45-0ubuntu0.24.04.1
-- Wersja PHP: 8.3.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `chess_db`
--

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `players_online`
--

CREATE TABLE `players_online` (
  `total` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_croatian_ci;

--
-- Dumping data for table `players_online`
--

INSERT INTO `players_online` (`total`) VALUES
(0);

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `user`
--

CREATE TABLE `user` (
  `id` int NOT NULL,
  `first_name` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_croatian_ci NOT NULL,
  `last_name` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_croatian_ci NOT NULL,
  `username` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_croatian_ci NOT NULL,
  `password` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_croatian_ci NOT NULL,
  `email` varchar(80) CHARACTER SET utf8mb4 COLLATE utf8mb4_croatian_ci NOT NULL,
  `access` tinyint(1) NOT NULL,
  `cookie` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_croatian_ci DEFAULT NULL,
  `expire` int DEFAULT '0',
  `photo` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_croatian_ci NOT NULL DEFAULT 'default.png',
  `online` int NOT NULL,
  `token` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_croatian_ci NOT NULL,
  `token_expire` int NOT NULL,
  `ws_token` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_croatian_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_croatian_ci;

--
-- Indeksy dla zrzutów tabel
--

--
-- Indeksy dla tabeli `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=63;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
