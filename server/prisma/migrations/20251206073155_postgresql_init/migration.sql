-- CreateEnum
CREATE TYPE "MessageStatus" AS ENUM ('sent', 'delivered', 'read');

-- CreateTable
CREATE TABLE "data_changes" (
    "id" SERIAL NOT NULL,
    "table_name" VARCHAR(255),
    "change_time" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "data_changes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mall_administrator" (
    "id" SERIAL NOT NULL,
    "user_id" BIGINT,
    "account" VARCHAR(50),
    "username" VARCHAR(50),
    "password" VARCHAR(50),
    "avatar" TEXT,
    "gender" BOOLEAN NOT NULL DEFAULT false,
    "last_login_time" TIMESTAMP(0),
    "identity" SMALLINT NOT NULL DEFAULT 0,

    CONSTRAINT "mall_administrator_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mall_banner" (
    "id" SERIAL NOT NULL,
    "banner_image" VARCHAR(666) NOT NULL DEFAULT '0',
    "brand_id" BIGINT NOT NULL DEFAULT 0,
    "brand" VARCHAR(20) NOT NULL DEFAULT '0',
    "isShow" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mall_banner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mall_brand" (
    "brand_id" BIGSERIAL NOT NULL,
    "brand" VARCHAR(50),
    "brand_logo" VARCHAR(255),

    CONSTRAINT "mall_brand_pkey" PRIMARY KEY ("brand_id")
);

-- CreateTable
CREATE TABLE "mall_category" (
    "id" SERIAL NOT NULL,
    "category" VARCHAR(50) NOT NULL DEFAULT '',
    "category_id" INTEGER,

    CONSTRAINT "mall_category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mall_category_detail" (
    "id" SERIAL NOT NULL,
    "category_id" INTEGER NOT NULL DEFAULT 0,
    "category_title" VARCHAR(50) NOT NULL DEFAULT '0',
    "category_text" VARCHAR(50) NOT NULL DEFAULT '0',
    "imagePath" VARCHAR(255) NOT NULL DEFAULT '0',

    CONSTRAINT "mall_category_detail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mall_goods" (
    "id" SERIAL NOT NULL,
    "product_id" VARCHAR(50),
    "product_title" VARCHAR(50) NOT NULL,
    "product_image" VARCHAR(255) NOT NULL,
    "product_type" VARCHAR(50) NOT NULL,
    "product_brand" VARCHAR(50) NOT NULL,
    "price" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    "favorite" INTEGER NOT NULL DEFAULT 0,
    "comment_number" INTEGER NOT NULL DEFAULT 0,
    "stocks" INTEGER NOT NULL DEFAULT 0,
    "unit" CHAR(50) NOT NULL DEFAULT '件',
    "isPreferential" BOOLEAN NOT NULL DEFAULT false,
    "preferential_type" VARCHAR(50) NOT NULL,
    "isHot" BOOLEAN NOT NULL DEFAULT false,
    "sales" INTEGER NOT NULL DEFAULT 0,
    "sell_type" VARCHAR(50) NOT NULL,
    "page" INTEGER NOT NULL DEFAULT 1,
    "self_support" BOOLEAN NOT NULL DEFAULT true,
    "discount" DOUBLE PRECISION DEFAULT 0.9,
    "brand_id" BIGINT,
    "weight" DECIMAL(10,1),
    "size_type" INTEGER DEFAULT 0,
    "flash_sale_time" INTEGER,
    "isGrounding" INTEGER DEFAULT 1,

    CONSTRAINT "mall_goods_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mall_goods_attribute" (
    "id" SERIAL NOT NULL,
    "product_id" VARCHAR(50),
    "attribute_title" VARCHAR(50) DEFAULT '0',
    "attribute" TEXT NOT NULL,

    CONSTRAINT "mall_goods_attribute_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mall_goods_gallery" (
    "id" SERIAL NOT NULL,
    "product_id" VARCHAR(50),
    "product_image" VARCHAR(255) NOT NULL DEFAULT '0',

    CONSTRAINT "mall_goods_gallery_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mall_preferential" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50),
    "use_threshold" INTEGER NOT NULL,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "expiration_time" INTEGER NOT NULL DEFAULT 0,
    "release_status" SMALLINT NOT NULL DEFAULT 0,
    "type" VARCHAR(50) NOT NULL DEFAULT '满减',
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mall_preferential_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mall_store_order" (
    "id" SERIAL NOT NULL,
    "user_id" BIGINT,
    "order_id" VARCHAR(50),
    "product_ids" VARCHAR(255),
    "product_num" VARCHAR(255),
    "product_size" VARCHAR(255),
    "total_num" INTEGER,
    "total_price" DOUBLE PRECISION,
    "payment_status" INTEGER NOT NULL DEFAULT 0,
    "product_types" VARCHAR(50),
    "sell_types" VARCHAR(50),

    CONSTRAINT "mall_store_order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mall_user" (
    "id" SERIAL NOT NULL,
    "user_id" BIGINT,
    "account" VARCHAR(50),
    "username" VARCHAR(50),
    "password" VARCHAR(50),
    "gender" BOOLEAN NOT NULL DEFAULT false,
    "avatar" VARCHAR(255),
    "register_time" VARCHAR(50),
    "last_login_time" DATE,
    "identity" SMALLINT NOT NULL DEFAULT 0,

    CONSTRAINT "mall_user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mall_user_address" (
    "id" BIGINT NOT NULL DEFAULT 0,
    "user_id" BIGINT NOT NULL DEFAULT 0,
    "region" VARCHAR(255),
    "complete_address" VARCHAR(255),
    "username" VARCHAR(50),
    "phone" VARCHAR(50),
    "isDefault" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "mall_user_address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mall_user_brand_collection" (
    "id" INTEGER NOT NULL,
    "brand" VARCHAR(50) NOT NULL DEFAULT '',
    "user_id" BIGINT,

    CONSTRAINT "mall_user_brand_collection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mall_user_cart" (
    "id" SERIAL NOT NULL,
    "user_id" BIGINT NOT NULL DEFAULT 0,
    "product_id" VARCHAR(50),
    "product_title" VARCHAR(255) NOT NULL DEFAULT '',
    "product_image" VARCHAR(1000) NOT NULL DEFAULT '',
    "product_price" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    "quantity" SMALLINT NOT NULL DEFAULT 1,
    "isChecked" BOOLEAN NOT NULL DEFAULT true,
    "size" VARCHAR(50),

    CONSTRAINT "mall_user_cart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mall_user_collection" (
    "id" SERIAL NOT NULL,
    "user_id" BIGINT NOT NULL DEFAULT 0,
    "product_id" VARCHAR(50),
    "product_title" VARCHAR(50) NOT NULL DEFAULT '0',
    "product_image" VARCHAR(255) NOT NULL DEFAULT '0',
    "price" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    "product_type" VARCHAR(50),

    CONSTRAINT "mall_user_collection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mall_user_comments" (
    "id" SERIAL NOT NULL,
    "account" VARCHAR(50) NOT NULL DEFAULT '0',
    "username" VARCHAR(50) NOT NULL DEFAULT '0',
    "avatar" VARCHAR(255) NOT NULL DEFAULT '0',
    "product_id" VARCHAR(50) NOT NULL,
    "comments_text" VARCHAR(50),
    "comments_image" VARCHAR(50),
    "comments_video" VARCHAR(50),
    "comments_time" VARCHAR(50) NOT NULL DEFAULT '0',
    "stars" SMALLINT NOT NULL DEFAULT 5,
    "size" VARCHAR(50),

    CONSTRAINT "mall_user_comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mall_user_history" (
    "id" SERIAL NOT NULL,
    "user_id" BIGINT NOT NULL DEFAULT 0,
    "product_id" VARCHAR(50) NOT NULL DEFAULT '0',

    CONSTRAINT "mall_user_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mall_user_recommend_goods" (
    "id" INTEGER NOT NULL,
    "product_id" VARCHAR(50) NOT NULL DEFAULT '',
    "user_id" BIGINT,

    CONSTRAINT "mall_user_recommend_goods_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mall_user_search_word" (
    "id" SERIAL NOT NULL,
    "word" TEXT,
    "search_count" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "mall_user_search_word_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mall_video" (
    "uid" BIGINT NOT NULL DEFAULT 0,
    "user_id" BIGINT,
    "video_url" TEXT,
    "image_url" TEXT,
    "title" VARCHAR(255),
    "upload_time" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" VARCHAR(255),
    "last_modified" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mall_video_pkey" PRIMARY KEY ("uid")
);

-- CreateTable
CREATE TABLE "mall_visitor" (
    "id" SERIAL NOT NULL,
    "ip" VARCHAR(50),
    "count" INTEGER DEFAULT 1,
    "time" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mall_visitor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT,
    "password" TEXT,
    "avatar" TEXT,
    "is_online" BOOLEAN NOT NULL DEFAULT false,
    "last_seen" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "sender_id" TEXT NOT NULL,
    "receiver_id" TEXT NOT NULL,
    "send_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "read_at" TIMESTAMP(3),
    "avatar" TEXT,
    "status" "MessageStatus" NOT NULL DEFAULT 'sent',

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AI_conversation" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "response" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "responded_at" TIMESTAMP(3),

    CONSTRAINT "AI_conversation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Error_log" (
    "id" TEXT NOT NULL,
    "user_id" TEXT,
    "error_type" TEXT NOT NULL,
    "error_message" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Error_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "category_lists" (
    "_id" BIGSERIAL NOT NULL,
    "categoryId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "coverImage" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "category_lists_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "category_details" (
    "_id" BIGSERIAL NOT NULL,
    "categoryId" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "productImage" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "originalPrice" DOUBLE PRECISION,
    "sales" INTEGER NOT NULL DEFAULT 0,
    "rating" DOUBLE PRECISION DEFAULT 0,
    "tags" TEXT,
    "description" TEXT,
    "specifications" JSONB,
    "isInStock" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "category_details_pkey" PRIMARY KEY ("_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "mall_administrator_user_id_key" ON "mall_administrator"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "mall_administrator_account_key" ON "mall_administrator"("account");

-- CreateIndex
CREATE INDEX "category_id" ON "mall_category"("category_id");

-- CreateIndex
CREATE INDEX "mall_category_detail_product_id" ON "mall_category_detail"("category_id");

-- CreateIndex
CREATE UNIQUE INDEX "mall_goods_id_key" ON "mall_goods"("id");

-- CreateIndex
CREATE UNIQUE INDEX "mall_goods_product_id_key" ON "mall_goods"("product_id");

-- CreateIndex
CREATE INDEX "mall_goods_product_id" ON "mall_goods"("product_id");

-- CreateIndex
CREATE INDEX "mall_goods_attribute_product_id" ON "mall_goods_attribute"("product_id");

-- CreateIndex
CREATE INDEX "mall_goods_gallery_product_id" ON "mall_goods_gallery"("product_id");

-- CreateIndex
CREATE UNIQUE INDEX "mall_user_user_id_key" ON "mall_user"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "mall_user_account_key" ON "mall_user"("account");

-- CreateIndex
CREATE UNIQUE INDEX "mall_video_uid_key" ON "mall_video"("uid");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_username_idx" ON "User"("username");

-- CreateIndex
CREATE INDEX "User_is_online_idx" ON "User"("is_online");

-- CreateIndex
CREATE INDEX "Message_sender_id_idx" ON "Message"("sender_id");

-- CreateIndex
CREATE INDEX "Message_receiver_id_idx" ON "Message"("receiver_id");

-- CreateIndex
CREATE INDEX "Message_send_time_idx" ON "Message"("send_time");

-- CreateIndex
CREATE INDEX "Message_status_idx" ON "Message"("status");

-- CreateIndex
CREATE INDEX "AI_conversation_user_id_idx" ON "AI_conversation"("user_id");

-- CreateIndex
CREATE INDEX "AI_conversation_timestamp_idx" ON "AI_conversation"("timestamp");

-- CreateIndex
CREATE INDEX "Error_log_user_id_idx" ON "Error_log"("user_id");

-- CreateIndex
CREATE INDEX "Error_log_timestamp_idx" ON "Error_log"("timestamp");

-- CreateIndex
CREATE UNIQUE INDEX "category_lists_categoryId_key" ON "category_lists"("categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "category_lists_name_key" ON "category_lists"("name");

-- CreateIndex
CREATE UNIQUE INDEX "category_details_categoryId_key" ON "category_details"("categoryId");

-- CreateIndex
CREATE INDEX "category_details_categoryId_idx" ON "category_details"("categoryId");

-- CreateIndex
CREATE INDEX "category_details_sales_idx" ON "category_details"("sales");

-- CreateIndex
CREATE INDEX "category_details_rating_idx" ON "category_details"("rating");

-- AddForeignKey
ALTER TABLE "mall_store_order" ADD CONSTRAINT "mall_store_order_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "mall_user"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_receiver_id_fkey" FOREIGN KEY ("receiver_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AI_conversation" ADD CONSTRAINT "AI_conversation_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Error_log" ADD CONSTRAINT "Error_log_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "category_details" ADD CONSTRAINT "category_details_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "category_lists"("categoryId") ON DELETE CASCADE ON UPDATE CASCADE;
