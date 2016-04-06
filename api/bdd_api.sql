-- phpMyAdmin SQL Dump
-- version 4.5.1
-- http://www.phpmyadmin.net
--
-- Client :  127.0.0.1
-- Généré le :  Mer 06 Avril 2016 à 19:18
-- Version du serveur :  5.7.9
-- Version de PHP :  5.6.15

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données :  `prefib`
--

-- --------------------------------------------------------

--
-- Structure de la table `commentaire`
--

DROP TABLE IF EXISTS `commentaire`;
CREATE TABLE IF NOT EXISTS `commentaire` (
  `id_commentaire` int(11) NOT NULL DEFAULT '0',
  `texte` text,
  `date` date DEFAULT NULL,
  `id_type_commentaire` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_commentaire`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Contenu de la table `commentaire`
--

INSERT INTO `commentaire` (`id_commentaire`, `texte`, `date`, `id_type_commentaire`) VALUES
(2, 'Goldman Sachs anticipe une accélération du « QE » de la BCE et une baisse de taux en mars', '2016-02-29', 0);

-- --------------------------------------------------------

--
-- Structure de la table `commentaire_indice`
--

DROP TABLE IF EXISTS `commentaire_indice`;
CREATE TABLE IF NOT EXISTS `commentaire_indice` (
  `id_commentaire` int(11) NOT NULL DEFAULT '0',
  `id_indice` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id_commentaire`,`id_indice`),
  KEY `id_indice` (`id_indice`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Contenu de la table `commentaire_indice`
--

INSERT INTO `commentaire_indice` (`id_commentaire`, `id_indice`) VALUES
(2, 4);

-- --------------------------------------------------------

--
-- Structure de la table `continent`
--

DROP TABLE IF EXISTS `continent`;
CREATE TABLE IF NOT EXISTS `continent` (
  `id_continent` int(11) NOT NULL DEFAULT '0',
  `nom_continent` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id_continent`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Contenu de la table `continent`
--

INSERT INTO `continent` (`id_continent`, `nom_continent`) VALUES
(0, 'États-Unis'),
(1, 'Europe'),
(2, 'Asie');

-- --------------------------------------------------------

--
-- Structure de la table `indice`
--

DROP TABLE IF EXISTS `indice`;
CREATE TABLE IF NOT EXISTS `indice` (
  `id_indice` int(11) NOT NULL AUTO_INCREMENT,
  `nom_indice` varchar(255) DEFAULT NULL,
  `id_continent` int(11) DEFAULT NULL,
  `couleur` char(7) DEFAULT NULL,
  `sectoriel` tinyint(1) DEFAULT NULL,
  `symbole` varchar(250) NOT NULL,
  PRIMARY KEY (`id_indice`),
  KEY `indice_ibfk_1` (`id_continent`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8;

--
-- Contenu de la table `indice`
--

INSERT INTO `indice` (`id_indice`, `nom_indice`, `id_continent`, `couleur`, `sectoriel`, `symbole`) VALUES
(3, 'DOW JONES', 0, '#2d2dff', 0, '^DJI'),
(4, 'NASDAQ', 0, '#071BA3', 0, ''),
(5, 'BBBB', 1, '#145EDE', 0, ''),
(6, 'CAC40', 1, '#96B7E3', 0, '^FCHI'),
(7, 'IBEX', 1, '#D313E8', 0, ''),
(8, 'MIB', 1, '#F7812D', 0, ''),
(9, 'Euro Stoxx50', 1, '#505D61', 0, ''),
(10, 'NIKKEI250', 2, '#071BA3', 0, ''),
(11, 'SSE', 2, '#145EDE', 0, ''),
(12, 'HS', 2, '#96B7E3', 0, ''),
(15, 'Indices sectoriels plus AAA', 0, '#96B7E3', 1, ''),
(16, 'Indices sectoriels bbbbb', 0, '#96B7E3', 1, ''),
(17, 'Indices sectoriels plus performants ', 0, '#96B7E3', 1, ''),
(18, 'Indices sectoriels moins performants ', 0, '#96B7E3', 1, '');

-- --------------------------------------------------------

--
-- Structure de la table `type_commentaire`
--

DROP TABLE IF EXISTS `type_commentaire`;
CREATE TABLE IF NOT EXISTS `type_commentaire` (
  `id_type_commentaire` int(11) NOT NULL DEFAULT '0',
  `description` varchar(255) DEFAULT NULL,
  `icone` varchar(31) DEFAULT NULL,
  `couleur` char(7) DEFAULT NULL,
  PRIMARY KEY (`id_type_commentaire`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Contenu de la table `type_commentaire`
--

INSERT INTO `type_commentaire` (`id_type_commentaire`, `description`, `icone`, `couleur`) VALUES
(1, 'Prévision Goldman Sachs', 'test1', '#123456');

-- --------------------------------------------------------

--
-- Structure de la table `type_valeur`
--

DROP TABLE IF EXISTS `type_valeur`;
CREATE TABLE IF NOT EXISTS `type_valeur` (
  `id_type_valeur` int(11) NOT NULL AUTO_INCREMENT,
  `nom_type_valeur` varchar(255) NOT NULL,
  `couleur_type_valeur` char(7) NOT NULL,
  PRIMARY KEY (`id_type_valeur`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

--
-- Contenu de la table `type_valeur`
--

INSERT INTO `type_valeur` (`id_type_valeur`, `nom_type_valeur`, `couleur_type_valeur`) VALUES
(0, 'moyenne', ''),
(1, 'min', '#fe4e4e'),
(2, 'max', '#4efe4e');

-- --------------------------------------------------------

--
-- Structure de la table `type_valeur_api`
--

DROP TABLE IF EXISTS `type_valeur_api`;
CREATE TABLE IF NOT EXISTS `type_valeur_api` (
  `id_type_valeur_api` int(11) NOT NULL AUTO_INCREMENT,
  `nom_type_valeur` varchar(250) NOT NULL,
  `couleur_type_valeur` char(7) NOT NULL,
  PRIMARY KEY (`id_type_valeur_api`)
) ENGINE=MyISAM AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;

--
-- Contenu de la table `type_valeur_api`
--

INSERT INTO `type_valeur_api` (`id_type_valeur_api`, `nom_type_valeur`, `couleur_type_valeur`) VALUES
(1, 'min', ''),
(2, 'max', ''),
(3, 'ouv', ''),
(4, 'fer', ''),
(5, 'actuel', ''),
(6, 'fermeture', '');

-- --------------------------------------------------------

--
-- Structure de la table `valeur`
--

DROP TABLE IF EXISTS `valeur`;
CREATE TABLE IF NOT EXISTS `valeur` (
  `annuelle` tinyint(1) NOT NULL,
  `id_indice` int(11) NOT NULL DEFAULT '0',
  `periode` date NOT NULL DEFAULT '0000-00-00',
  `id_type_valeur` int(11) NOT NULL DEFAULT '0',
  `valeur` float DEFAULT NULL,
  `est_prevision` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id_indice`,`periode`,`id_type_valeur`,`annuelle`),
  KEY `valeur_ibfk_2` (`id_type_valeur`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Contenu de la table `valeur`
--

INSERT INTO `valeur` (`annuelle`, `id_indice`, `periode`, `id_type_valeur`, `valeur`, `est_prevision`) VALUES
(1, 3, '2013-01-01', 0, 15010, 0),
(1, 3, '2014-01-01', 0, 16795, 0),
(1, 3, '2015-01-01', 0, 17587, 0),
(0, 3, '2015-03-31', 0, 19000, 0),
(0, 3, '2015-03-31', 1, 15855, 0),
(0, 3, '2015-03-31', 2, 18103, 0),
(0, 3, '2015-06-30', 0, 17700, 0),
(0, 3, '2015-06-30', 1, 17037, 0),
(0, 3, '2015-06-30', 2, 18288, 0),
(0, 3, '2015-09-30', 0, 17854, 0),
(0, 3, '2015-09-30', 1, 17576, 0),
(0, 3, '2015-09-30', 2, 18351, 0),
(0, 3, '2015-12-31', 0, 17061, 0),
(0, 3, '2015-12-31', 1, 15370, 0),
(0, 3, '2015-12-31', 2, 18137, 0),
(1, 3, '2016-01-01', 0, 17000, 0),
(0, 3, '2016-03-31', 0, 16200, 1),
(0, 3, '2016-03-31', 1, 14580, 1),
(0, 3, '2016-03-31', 2, 17010, 1),
(1, 3, '2017-01-01', 0, 17200, 1),
(1, 3, '2018-01-01', 0, 18000, 1),
(1, 4, '2012-01-01', 0, 1999, 0),
(0, 4, '2015-03-31', 0, 4894, 0),
(0, 4, '2015-03-31', 1, 4500, 0),
(0, 4, '2015-03-31', 2, 5250, 0),
(0, 4, '2015-06-30', 1, 4200, 0),
(0, 4, '2015-06-30', 2, 5200, 0),
(0, 4, '2015-09-30', 0, 4814, 0),
(0, 4, '2015-09-30', 1, 4650, 0),
(0, 4, '2015-09-30', 2, 5000, 0),
(1, 5, '2012-01-01', 0, 10000, 0),
(1, 15, '2012-01-01', 0, NULL, 0);

-- --------------------------------------------------------

--
-- Structure de la table `valeur_api`
--

DROP TABLE IF EXISTS `valeur_api`;
CREATE TABLE IF NOT EXISTS `valeur_api` (
  `id_indice` int(11) NOT NULL DEFAULT '0',
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `id_type_valeur_api` int(11) NOT NULL DEFAULT '0',
  `valeur` float DEFAULT NULL,
  `date_maj` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_type_valeur_api`,`date`,`id_indice`) USING BTREE,
  KEY `id_type_valeur_api` (`id_type_valeur_api`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Contenu de la table `valeur_api`
--

INSERT INTO `valeur_api` (`id_indice`, `date`, `id_type_valeur_api`, `valeur`, `date_maj`) VALUES
(3, '2016-03-24 23:00:00', 1, 17399, '2016-03-24 23:38:12'),
(6, '2016-03-24 23:00:00', 1, 4325.54, '2016-03-24 23:38:12'),
(3, '2016-04-05 22:00:00', 1, 17542.5, '2016-04-06 17:16:54'),
(6, '2016-04-05 22:00:00', 1, 4251.15, '2016-04-06 17:16:54'),
(3, '2016-03-24 23:00:00', 2, 17517.1, '2016-03-24 23:38:12'),
(6, '2016-03-24 23:00:00', 2, 4392.19, '2016-03-24 23:38:12'),
(3, '2016-04-05 22:00:00', 2, 17696.1, '2016-04-06 17:16:54'),
(6, '2016-04-05 22:00:00', 2, 4280.45, '2016-04-06 17:16:54'),
(3, '2016-03-24 23:00:00', 5, 17515.7, '2016-03-24 23:38:12'),
(6, '2016-03-24 23:00:00', 5, 4329.68, '2016-03-24 23:38:12'),
(3, '2016-04-05 22:00:00', 5, 17690.2, '2016-04-06 17:16:54'),
(6, '2016-04-05 22:00:00', 5, 4284.64, '2016-04-06 17:16:54');

--
-- Contraintes pour les tables exportées
--

--
-- Contraintes pour la table `commentaire_indice`
--
ALTER TABLE `commentaire_indice`
  ADD CONSTRAINT `commentaire_indice_ibfk_1` FOREIGN KEY (`id_commentaire`) REFERENCES `commentaire` (`id_commentaire`),
  ADD CONSTRAINT `commentaire_indice_ibfk_2` FOREIGN KEY (`id_indice`) REFERENCES `indice` (`id_indice`);

--
-- Contraintes pour la table `indice`
--
ALTER TABLE `indice`
  ADD CONSTRAINT `indice_ibfk_1` FOREIGN KEY (`id_continent`) REFERENCES `continent` (`id_continent`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `valeur`
--
ALTER TABLE `valeur`
  ADD CONSTRAINT `valeur_ibfk_1` FOREIGN KEY (`id_indice`) REFERENCES `indice` (`id_indice`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `valeur_ibfk_2` FOREIGN KEY (`id_type_valeur`) REFERENCES `type_valeur` (`id_type_valeur`) ON DELETE CASCADE ON UPDATE CASCADE;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
