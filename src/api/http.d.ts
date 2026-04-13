export type ParamsType = {
    url: string
    method?: 'POST' | 'OPTIONS' | 'GET' | 'HEAD' | 'PUT' | 'DELETE' | 'TRACE' | 'CONNECT' | undefined
    filePath?: string
    data: any
    dataType?: string
    back?: boolean
}
