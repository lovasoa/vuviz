-- phpMyAdmin SQL Dump
-- version 4.4.13.1
-- http://www.phpmyadmin.net
--
-- Host: prefibcoti1.mysql.db
-- Generation Time: Feb 11, 2016 at 11:09 AM
-- Server version: 5.5.46-0+deb7u1-log
-- PHP Version: 5.3.8

SET FOREIGN_KEY_CHECKS=0;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `prefibcoti1`
--
CREATE DATABASE IF NOT EXISTS `prefibcoti1` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `prefibcoti1`;

-- --------------------------------------------------------

--
-- Table structure for table `commentaire`
--

DROP TABLE IF EXISTS `commentaire`;
CREATE TABLE IF NOT EXISTS `commentaire` (
  `id_commentaire` int(11) NOT NULL DEFAULT '0',
  `texte` text,
  `date` date DEFAULT NULL,
  `id_type_commentaire` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `commentaire_indice`
--

DROP TABLE IF EXISTS `commentaire_indice`;
CREATE TABLE IF NOT EXISTS `commentaire_indice` (
  `id_commentaire` int(11) NOT NULL DEFAULT '0',
  `id_indice` int(11) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `continent`
--

DROP TABLE IF EXISTS `continent`;
CREATE TABLE IF NOT EXISTS `continent` (
  `id_continent` int(11) NOT NULL DEFAULT '0',
  `nom_continent` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `continent`
--

INSERT INTO `continent` (`id_continent`, `nom_continent`) VALUES
(0, 'États-Unis'),
(1, 'Europe'),
(2, 'Asie');

-- --------------------------------------------------------

--
-- Table structure for table `indice`
--

DROP TABLE IF EXISTS `indice`;
CREATE TABLE IF NOT EXISTS `indice` (
  `id_indice` int(11) NOT NULL,
  `nom_indice` varchar(255) DEFAULT NULL,
  `id_continent` int(11) DEFAULT NULL,
  `couleur` char(7) DEFAULT NULL,
  `sectoriel` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `indice`
--

INSERT INTO `indice` (`id_indice`, `nom_indice`, `id_continent`, `couleur`, `sectoriel`) VALUES
(1, 'DOW JONES', 0, '#071BA3', 0),
(2, 'NASDAQ', 0, '#145EDE', 0),
(3, 'S&P500', 0, '#96B7E3', 0),
(4, 'DAX', 1, '#071BA3', 0),
(5, 'FOOTSIE', 1, '#145EDE', 0),
(6, 'CAC40', 1, '#96B7E3', 0),
(7, 'IBEX', 1, '#D313E8', 0),
(8, 'MIB', 1, '#F7812D', 0),
(9, 'Euro Stoxx50', 1, '#505D61', 0),
(10, 'NIKKEI250', 2, '#071BA3', 0),
(11, 'SSE', 2, '#145EDE', 0),
(12, 'HS', 2, '#96B7E3', 0),
(15, 'Indices sectoriels plus performants ', 1, '#96B7E3', 1),
(16, 'Indices sectoriels moins performants ', 1, '#96B7E3', 1),
(17, 'Indices sectoriels plus performants ', 0, '#96B7E3', 1),
(18, 'Indices sectoriels moins performants ', 0, '#96B7E3', 1);

-- --------------------------------------------------------

--
-- Table structure for table `type_commentaire`
--

DROP TABLE IF EXISTS `type_commentaire`;
CREATE TABLE IF NOT EXISTS `type_commentaire` (
  `id_type_commentaire` int(11) NOT NULL DEFAULT '0',
  `description` varchar(255) DEFAULT NULL,
  `icone` varchar(31) DEFAULT NULL,
  `couleur` char(7) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `type_valeur`
--

DROP TABLE IF EXISTS `type_valeur`;
CREATE TABLE IF NOT EXISTS `type_valeur` (
  `id_type_valeur` int(11) NOT NULL,
  `nom_type_valeur` varchar(255) NOT NULL,
  `couleur_type_valeur` char(7) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `type_valeur`
--

INSERT INTO `type_valeur` (`id_type_valeur`, `nom_type_valeur`, `couleur_type_valeur`) VALUES
(1, 'min', '#009900'),
(2, 'max', '#990000'),
(3, 'moyenne', '');

-- --------------------------------------------------------

--
-- Table structure for table `valeur`
--

DROP TABLE IF EXISTS `valeur`;
CREATE TABLE IF NOT EXISTS `valeur` (
  `id_indice` int(11) NOT NULL DEFAULT '0',
  `periode` date NOT NULL DEFAULT '0000-00-00',
  `id_type_valeur` int(11) NOT NULL DEFAULT '0',
  `valeur` float DEFAULT NULL,
  `est_prevision` tinyint(1) DEFAULT NULL,
  `annuelle` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `commentaire`
--
ALTER TABLE `commentaire`
  ADD PRIMARY KEY (`id_commentaire`);

--
-- Indexes for table `commentaire_indice`
--
ALTER TABLE `commentaire_indice`
  ADD PRIMARY KEY (`id_commentaire`,`id_indice`),
  ADD KEY `id_indice` (`id_indice`);

--
-- Indexes for table `continent`
--
ALTER TABLE `continent`
  ADD PRIMARY KEY (`id_continent`);

--
-- Indexes for table `indice`
--
ALTER TABLE `indice`
  ADD PRIMARY KEY (`id_indice`),
  ADD KEY `indice_ibfk_1` (`id_continent`);

--
-- Indexes for table `type_commentaire`
--
ALTER TABLE `type_commentaire`
  ADD PRIMARY KEY (`id_type_commentaire`);

--
-- Indexes for table `type_valeur`
--
ALTER TABLE `type_valeur`
  ADD PRIMARY KEY (`id_type_valeur`);

--
-- Indexes for table `valeur`
--
ALTER TABLE `valeur`
  ADD PRIMARY KEY (`id_indice`,`periode`,`id_type_valeur`),
  ADD KEY `valeur_ibfk_2` (`id_type_valeur`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `indice`
--
ALTER TABLE `indice`
  MODIFY `id_indice` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=19;
--
-- AUTO_INCREMENT for table `type_valeur`
--
ALTER TABLE `type_valeur`
  MODIFY `id_type_valeur` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=4;
--
-- Constraints for dumped tables
--

--
-- Constraints for table `commentaire_indice`
--
ALTER TABLE `commentaire_indice`
  ADD CONSTRAINT `commentaire_indice_ibfk_2` FOREIGN KEY (`id_indice`) REFERENCES `indice` (`id_indice`),
  ADD CONSTRAINT `commentaire_indice_ibfk_1` FOREIGN KEY (`id_commentaire`) REFERENCES `commentaire` (`id_commentaire`);

--
-- Constraints for table `indice`
--
ALTER TABLE `indice`
  ADD CONSTRAINT `indice_ibfk_1` FOREIGN KEY (`id_continent`) REFERENCES `continent` (`id_continent`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `valeur`
--
ALTER TABLE `valeur`
  ADD CONSTRAINT `valeur_ibfk_1` FOREIGN KEY (`id_indice`) REFERENCES `indice` (`id_indice`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `valeur_ibfk_2` FOREIGN KEY (`id_type_valeur`) REFERENCES `type_valeur` (`id_type_valeur`) ON DELETE CASCADE ON UPDATE CASCADE;
SET FOREIGN_KEY_CHECKS=1;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
