import { http, upLoadFile } from '@/api/http'
const version = '/v1'

/**
 * @description: 获取简历详情
 */
export function getResumeView(data?: any) {
    return http({
        url: version + '/resume/query/view',
        data,
    })
}

/**
 * @description: 上传头像文件
 */
export function uploadResumeAvatar(filePath: string, data?: any) {
    return upLoadFile({
        url: version + '/resume/maintenance/upload_resume_avatar',
        filePath,
        data,
    })
}
/**
 * @description: 上传附件简历
 */
export function uploadResumeAnnex(filePath: string, data?: any) {
    return upLoadFile({
        url: version + '/resume/maintenance/upload_resume_annex',
        filePath,
        data,
    })
}

/**
 * @description: 保存简历
 */
export function saveResume(data?: any) {
    return http({
        url: version + '/resume/maintenance/save',
        data,
    })
}

/**
 * @description: 获取附件简历列表
 */
export function getAnnexList(data?: any) {
    return http({
        url: version + '/resume/annex/list',
        data,
    })
}

/**
 * @description: 保存附件简历
 */
export function saveUpload(data?: any) {
    return http({
        url: version + '/resume/annex/upload',
        data,
    })
}

/**
 * @description: 获取附件简历详情
 */
export function getAnnexDetail(data?: any) {
    return http({
        url: version + '/resume/annex/detail',
        data,
    })
}

/**
 * @description: 搜索职位名称
 */
export function searchJobCategory(data?: any) {
    return http({
        url: version + '/resume/query/search_job_category',
        data,
    })
}

/**
 * @description: 附件简历解析
 */
export function annexParse(data?: any) {
    return http({
        url: version + '/resume/annex/parse',
        data,
    })
}
