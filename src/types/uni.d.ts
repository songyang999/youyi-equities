import type { Uni as _Uni } from '@dcloudio/types'

declare global {
    interface Uni extends _Uni {
        getWindowInfo(options?: any): void
    }
}
