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
--> statement-breakpoint
CREATE TABLE `orders` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int,
	`total` decimal(10,2) NOT NULL,
	`status` varchar(100) DEFAULT 'pending',
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `orders_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `order_items` (
	`id` int AUTO_INCREMENT NOT NULL,
	`order_id` int NOT NULL,
	`product_id` int NOT NULL,
	`quantity` int NOT NULL,
	`price` decimal(10,2) NOT NULL,
	CONSTRAINT `order_items_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `order_items` ADD CONSTRAINT `order_items_order_id_orders_id_fk` FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `order_items` ADD CONSTRAINT `order_items_product_id_products_id_fk` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE cascade ON UPDATE no action;