import { IsEnum, IsNumber, IsOptional, IsString, Max, Min, MinLength, } from "class-validator";
import { ProductSortBy, SortOrder, StatusStock } from "src/common/enum/product";

export class FilterProductDto {

    @IsOptional()
    @IsNumber()
    @Min(1)
    page?: number = 1;

    @IsOptional()
    @IsNumber()
    @Min(1)
    @Max(100)
    limit?: number = 20;

    @IsOptional()
    @IsString()
    @MinLength(2)
    search: string;

    @IsOptional()
    @IsString()
    categories?: string;

    @IsOptional()
    @IsNumber()
    min_price?: number;

    @IsOptional()
    @IsNumber()
    max_price?: number;

    @IsOptional()
    @IsEnum(StatusStock)
    stock_status?: StatusStock.OUT_OF_STOCK | StatusStock.LOW_STOCK | StatusStock.IN_STOCK;

    @IsOptional()
    @IsEnum(ProductSortBy)
    sort_by?: ProductSortBy.NAME | ProductSortBy.PRICE | ProductSortBy.STOCK | ProductSortBy.CREATED_AT;

    @IsOptional()
    @IsEnum(SortOrder)
    sort_order?: SortOrder.ASC | SortOrder.DESC;
}