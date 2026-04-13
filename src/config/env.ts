import dev from './env.dev'
import pre from './env.pre'
import trial from './env.trial'
import prod from './env.prod'

const NODE_ENV = import.meta.env.MODE // 获取打包环境

let ENV_VAR: EnvVarType = {
    BASE_API: '',
    IMG_URL: '',
    ENV_VERSION: 'release',
}
if (NODE_ENV === 'dev') {
    ENV_VAR = dev
} else if (NODE_ENV === 'pre') {
    ENV_VAR = pre
} else if (NODE_ENV === 'trial') {
    ENV_VAR = trial
} else if (NODE_ENV === 'prod') {
    ENV_VAR = prod
}

export default ENV_VAR
