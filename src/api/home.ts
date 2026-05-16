/**
 * @Author: XHL
 * @Date: 2026-05-15
 * @Description: 首页API
*/
import { http } from "@/api/http";

/**
 * @description: 首页数据
 */
export function homePage(data?: any) {
    return http({
        url: "/equities/homePage",
        data,
    });
}
