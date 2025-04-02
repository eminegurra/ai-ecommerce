CREATE TABLE `products` (
	`id` int AUTO_INCREMENT NOT NULL,
	`serial_number` varchar(100) NOT NULL,
	`name` varchar(255) NOT NULL,
	`brand` varchar(100) NOT NULL,
	`description` text,
	`category` varchar(100),
	`price` decimal(10,2) NOT NULL,
	`image_url` varchar(255),
	CONSTRAINT `products_id` PRIMARY KEY(`id`),
	CONSTRAINT `products_serial_number_unique` UNIQUE(`serial_number`)
);
