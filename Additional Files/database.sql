-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 05, 2021 at 11:20 AM
-- Server version: 10.4.11-MariaDB
-- PHP Version: 7.4.5

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `dwt`
--

-- --------------------------------------------------------

--
-- Table structure for table `assigned_pupil`
--

CREATE TABLE `assigned_pupil` (
  `assign_id` int(11) NOT NULL,
  `class_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL COMMENT 'user as student'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `assigned_pupil`
--

INSERT INTO `assigned_pupil` (`assign_id`, `class_id`, `user_id`) VALUES
(1, 1, 5),
(2, 1, 6),
(3, 2, 7);

-- --------------------------------------------------------

--
-- Table structure for table `assign_teacher`
--

CREATE TABLE `assign_teacher` (
  `assign_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `subject_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `assign_teacher`
--

INSERT INTO `assign_teacher` (`assign_id`, `user_id`, `subject_id`, `created_at`) VALUES
(1, 2, 1, '2021-07-03 15:34:49'),
(2, 2, 2, '2021-07-03 15:35:06'),
(3, 3, 3, '2021-07-03 15:35:36'),
(4, 3, 4, '2021-07-03 15:36:21'),
(5, 9, 5, '2021-07-03 15:38:19'),
(6, 9, 6, '2021-07-03 15:38:31'),
(7, 2, 7, '2021-07-03 21:35:13'),
(8, 2, 8, '2021-07-05 07:00:43'),
(9, 3, 9, '2021-07-05 07:04:21'),
(10, 2, 10, '2021-07-05 07:10:23'),
(11, 3, 11, '2021-07-05 07:22:24'),
(12, 2, 12, '2021-07-05 07:28:09');

-- --------------------------------------------------------

--
-- Table structure for table `class`
--

CREATE TABLE `class` (
  `class_id` int(11) NOT NULL,
  `class_name` varchar(32) NOT NULL,
  `is_archived` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `class`
--

INSERT INTO `class` (`class_id`, `class_name`, `is_archived`) VALUES
(1, 'Class 1', 0),
(2, 'Class 2', 0),
(3, 'Class 3', 1),
(4, 'Class 4', 1);

-- --------------------------------------------------------

--
-- Table structure for table `mark`
--

CREATE TABLE `mark` (
  `mark_id` int(11) NOT NULL,
  `test_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL COMMENT 'user as student',
  `marks` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `mark`
--

INSERT INTO `mark` (`mark_id`, `test_id`, `user_id`, `marks`) VALUES
(1, 1, 5, 1.2),
(2, 1, 6, 2.5),
(3, 5, 5, 1.7),
(4, 5, 6, 2.3);

-- --------------------------------------------------------

--
-- Table structure for table `subject`
--

CREATE TABLE `subject` (
  `subject_id` int(11) NOT NULL,
  `subject_name` varchar(32) NOT NULL,
  `class_id` int(11) NOT NULL,
  `is_archived` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `subject`
--

INSERT INTO `subject` (`subject_id`, `subject_name`, `class_id`, `is_archived`) VALUES
(1, 'Math 1', 1, 1),
(2, 'Math 2', 2, 0),
(3, 'Bengali 2', 2, 0),
(4, 'Social Science 2', 2, 0),
(5, 'Science 1', 1, 1),
(12, 'Web Technique 1', 1, 0);

-- --------------------------------------------------------

--
-- Table structure for table `test`
--

CREATE TABLE `test` (
  `test_id` int(11) NOT NULL,
  `test_name` varchar(32) NOT NULL,
  `subject_id` int(11) NOT NULL,
  `date` timestamp NOT NULL DEFAULT current_timestamp(),
  `is_complete` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `test`
--

INSERT INTO `test` (`test_id`, `test_name`, `subject_id`, `date`, `is_complete`) VALUES
(1, 'Math', 1, '2021-07-03 15:43:12', 1),
(2, 'Math test 2', 1, '2021-07-03 15:42:23', 0),
(3, 'Math test 3', 1, '2021-07-03 15:42:50', 0),
(4, 'testx', 5, '2021-07-03 21:24:54', 0),
(5, 'Test 1', 12, '2021-07-05 07:29:46', 1);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `user_name` varchar(32) NOT NULL,
  `password` varchar(256) NOT NULL,
  `first_name` varchar(32) NOT NULL,
  `last_name` varchar(32) NOT NULL,
  `user_type` varchar(8) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `user_name`, `password`, `first_name`, `last_name`, `user_type`, `created_at`) VALUES
(1, 'admin', '$2b$10$caHdrkuytvqnHfT/6hB0AunX5Vnc4WzRMiKFvU2Ju6fWwgT9gMioO', 'Yasin', 'Arafat', 'admin', '2021-07-03 15:26:38'),
(2, 'rahim', '$2b$10$2lQbut7sT9xAJLpM2U9.b.iTSxCXDlIYJ9oBPGsqbOXG53obQuJk6', 'Md', 'Rahim', 'teacher', '2021-07-03 15:29:52'),
(3, 'krishna', '$2b$10$0tDIlcDJ6ly.B1WABEhcO.hfMmupDTmC50LjnZ6VLewKIPJe87X9m', 'Krishna', 'Murthy', 'teacher', '2021-07-03 15:30:19'),
(4, 'nixon', '$2b$10$6/b24puRrIeSy3G11EjxEeCCgcjfqMrhUvMiW2K8IwHCCqLyAQtlK', 'Nixon', 'Barua', 'teacher', '2021-07-03 15:30:57'),
(5, 'pranto', '$2b$10$lwIFrw7bc2XojUeiRRGre.yrD1jTWxRAuS3Zj9WsBp/0WrG8ZP4pu', 'Pranto', 'Ahmed', 'student', '2021-07-03 15:31:44'),
(6, 'arnob', '$2b$10$Z/7Z85oB.92hR9.fK/kFqOg236pMbc26RaNJTl7JksRDTLEamySjO', 'Arnob', 'Chowdhury', 'student', '2021-07-03 15:32:07'),
(7, 'shafin', '$2b$10$KghvKBn8c4sRHjnbHCbkkOe.h6G3w5SA4tBkQZv5fdKpVwHavqYgq', 'Hafez', 'Shafin', 'student', '2021-07-03 15:32:37'),
(8, 'kalpana', '$2b$10$2zjeQwYEdXw.Q6D4EMVxa.E1f.A7FeVJPTpnZ0roxYv7Y26fGkhRO', 'Kalpana', 'Banarjee', 'student', '2021-07-03 15:33:11'),
(9, 'jafar', '$2b$10$Bq4Lb1Vdni0n/g60ZJpik.rWmj6Tw6AioJIxtQUL211dOwpmnvHxy', 'Jafar', 'Iqbal', 'teacher', '2021-07-03 15:38:03');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `assigned_pupil`
--
ALTER TABLE `assigned_pupil`
  ADD PRIMARY KEY (`assign_id`),
  ADD KEY `FK_assign_class_id` (`class_id`),
  ADD KEY `FK_assign_user_id` (`user_id`);

--
-- Indexes for table `assign_teacher`
--
ALTER TABLE `assign_teacher`
  ADD PRIMARY KEY (`assign_id`);

--
-- Indexes for table `class`
--
ALTER TABLE `class`
  ADD PRIMARY KEY (`class_id`),
  ADD UNIQUE KEY `class_name` (`class_name`);

--
-- Indexes for table `mark`
--
ALTER TABLE `mark`
  ADD PRIMARY KEY (`mark_id`),
  ADD KEY `FK_user_id` (`user_id`);

--
-- Indexes for table `subject`
--
ALTER TABLE `subject`
  ADD PRIMARY KEY (`subject_id`),
  ADD UNIQUE KEY `subject_name` (`subject_name`),
  ADD KEY `FK_class_id` (`class_id`);

--
-- Indexes for table `test`
--
ALTER TABLE `test`
  ADD PRIMARY KEY (`test_id`),
  ADD KEY `FK_subject_id` (`subject_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `user_name` (`user_name`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `assigned_pupil`
--
ALTER TABLE `assigned_pupil`
  MODIFY `assign_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `assign_teacher`
--
ALTER TABLE `assign_teacher`
  MODIFY `assign_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `class`
--
ALTER TABLE `class`
  MODIFY `class_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `mark`
--
ALTER TABLE `mark`
  MODIFY `mark_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `subject`
--
ALTER TABLE `subject`
  MODIFY `subject_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `test`
--
ALTER TABLE `test`
  MODIFY `test_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `assigned_pupil`
--
ALTER TABLE `assigned_pupil`
  ADD CONSTRAINT `FK_assign_class_id` FOREIGN KEY (`class_id`) REFERENCES `class` (`class_id`),
  ADD CONSTRAINT `FK_assign_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `mark`
--
ALTER TABLE `mark`
  ADD CONSTRAINT `FK_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `subject`
--
ALTER TABLE `subject`
  ADD CONSTRAINT `FK_class_id` FOREIGN KEY (`class_id`) REFERENCES `class` (`class_id`);

--
-- Constraints for table `test`
--
ALTER TABLE `test`
  ADD CONSTRAINT `FK_subject_id` FOREIGN KEY (`subject_id`) REFERENCES `subject` (`subject_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
