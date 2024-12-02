/*
 Navicat Premium Data Transfer

 Source Server         : localhost_3306
 Source Server Type    : MySQL
 Source Server Version : 100418
 Source Host           : localhost:3306
 Source Schema         : infokes

 Target Server Type    : MySQL
 Target Server Version : 100418
 File Encoding         : 65001

 Date: 02/12/2024 14:04:28
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for files
-- ----------------------------
DROP TABLE IF EXISTS `files`;
CREATE TABLE `files`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_folder` int NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `format` varchar(5) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `files_id`(`id`) USING BTREE,
  INDEX `files_id_folder`(`id_folder`) USING BTREE,
  INDEX `files_name`(`name`) USING BTREE,
  INDEX `files_format`(`format`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 8 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_bin ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of files
-- ----------------------------
INSERT INTO `files` VALUES (1, 14, 'foto', '.jpeg', '2024-11-05 15:09:32', '2024-11-05 15:09:32');
INSERT INTO `files` VALUES (2, 2, 'foto1', '.jpeg', '2024-11-13 16:34:40', '2024-11-13 16:34:40');
INSERT INTO `files` VALUES (3, 2, 'foto2', '.png', '2024-11-13 16:54:25', '2024-11-13 16:54:25');
INSERT INTO `files` VALUES (4, 2, 'a1', '.jpg', '2024-11-13 16:54:41', '2024-11-13 16:54:41');
INSERT INTO `files` VALUES (5, 23, 'music1', '.mp3', '2024-11-13 18:13:53', '2024-11-13 18:13:53');
INSERT INTO `files` VALUES (6, 23, 'music2', '.mp3', '2024-11-13 18:14:05', '2024-11-13 18:14:05');
INSERT INTO `files` VALUES (7, 28, 'music1', '.mp3', '2024-11-13 18:15:10', '2024-11-13 18:15:10');

-- ----------------------------
-- Table structure for folders
-- ----------------------------
DROP TABLE IF EXISTS `folders`;
CREATE TABLE `folders`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_parent` int NULL DEFAULT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `folders_id`(`id`) USING BTREE,
  INDEX `folders_id_parent`(`id_parent`) USING BTREE,
  INDEX `folders_name`(`name`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 29 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_bin ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of folders
-- ----------------------------
INSERT INTO `folders` VALUES (1, NULL, 'Documents', '2024-11-05 07:13:10', '2024-11-05 07:13:10');
INSERT INTO `folders` VALUES (2, 1, 'Photo', '2024-11-05 07:13:32', '2024-11-05 07:13:32');
INSERT INTO `folders` VALUES (3, NULL, 'Users', '2024-11-05 07:13:56', '2024-11-05 07:13:59');
INSERT INTO `folders` VALUES (4, 3, 'Folder 1', '2024-11-05 07:14:23', '2024-11-05 07:14:28');
INSERT INTO `folders` VALUES (5, 3, 'Folder 2', '2024-11-05 07:14:39', '2024-11-05 07:14:41');
INSERT INTO `folders` VALUES (6, 3, 'Folder 3', '2024-11-05 07:14:54', '2024-11-05 07:15:00');
INSERT INTO `folders` VALUES (7, 5, 'Sub Folder 1', '2024-11-05 07:15:19', '2024-11-05 07:15:21');
INSERT INTO `folders` VALUES (8, 5, 'Sub Folder 2', '2024-11-05 07:15:40', '2024-11-05 07:15:43');
INSERT INTO `folders` VALUES (9, 8, 'Sub Sub Folder 1', '2024-11-05 10:12:17', '2024-11-05 10:12:24');
INSERT INTO `folders` VALUES (10, 7, 'Sub Sub Folder 2', '2024-11-05 10:13:03', '2024-11-05 10:13:10');
INSERT INTO `folders` VALUES (14, NULL, 'folder baru', '2024-11-05 15:06:53', '2024-11-05 15:06:53');
INSERT INTO `folders` VALUES (16, 2, 'Old', '2024-11-13 16:49:28', '2024-11-13 16:49:28');
INSERT INTO `folders` VALUES (17, 2, 'New', '2024-11-13 16:49:47', '2024-11-13 16:49:47');
INSERT INTO `folders` VALUES (18, 2, '2023', '2024-11-13 16:51:26', '2024-11-13 16:51:26');
INSERT INTO `folders` VALUES (19, 2, '2021', '2024-11-13 16:53:56', '2024-11-13 16:53:56');
INSERT INTO `folders` VALUES (20, NULL, 'My Computer', '2024-11-13 18:10:06', '2024-11-13 18:10:06');
INSERT INTO `folders` VALUES (21, NULL, 'My Document', '2024-11-13 18:10:31', '2024-11-13 18:10:31');
INSERT INTO `folders` VALUES (23, NULL, 'Music', '2024-11-13 18:13:15', '2024-11-13 18:13:15');
INSERT INTO `folders` VALUES (24, 23, 'Pop', '2024-11-13 18:13:36', '2024-11-13 18:13:36');
INSERT INTO `folders` VALUES (25, 23, 'Jazz', '2024-11-13 18:13:44', '2024-11-13 18:13:44');
INSERT INTO `folders` VALUES (26, 25, 'sub jazz 1', '2024-11-13 18:14:21', '2024-11-13 18:14:21');
INSERT INTO `folders` VALUES (27, 25, 'sub jazz 2', '2024-11-13 18:14:36', '2024-11-13 18:14:36');
INSERT INTO `folders` VALUES (28, 26, 'sub sub jazz 1', '2024-11-13 18:14:49', '2024-11-13 18:14:49');

SET FOREIGN_KEY_CHECKS = 1;
