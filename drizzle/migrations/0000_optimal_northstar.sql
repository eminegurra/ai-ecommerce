CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255),
	CONSTRAINT `users_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` int AUTO_INCREMENT NOT NULL,
	`serial_number` varchar(100) NOT NULL,
	`name` varchar(255) NOT NULL,
	`brand_id` int NOT NULL,
	`category_id` int NOT NULL,
	`description` text,
	`price` decimal(10,2) NOT NULL,
	`image_url` varchar(255),
	CONSTRAINT `products_id` PRIMARY KEY(`id`),
	CONSTRAINT `products_serial_number_unique` UNIQUE(`serial_number`)
);
--> statement-breakpoint
CREATE TABLE `categories` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	CONSTRAINT `categories_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `brands` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	CONSTRAINT `brands_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `product_attributes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`product_id` int NOT NULL,
	`key` varchar(100) NOT NULL,
	`value` varchar(255) NOT NULL,
	CONSTRAINT `product_attributes_id` PRIMARY KEY(`id`)
);
