CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(50) NOT NULL,
	"hashed_password" varchar(100) NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"first_name" varchar(50) NOT NULL,
	"last_name" varchar(50) NOT NULL,
	"photo_url" varchar(200),
	"color" varchar(6) NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
