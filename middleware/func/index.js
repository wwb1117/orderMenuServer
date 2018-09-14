import * as get_Info_func from './get_info'
import * as db_func from './db'
import * as file_func from './file'
import * as time_func from './time'
import * as wx_func from './wx'


export default () => {
	const func = Object.assign({}, get_Info_func, db_func, file_func, time_func, wx_func)
	
    return async (ctx, next) => {
        for (let v in func) {
            if (func.hasOwnProperty(v)) {
				ctx[v] = func[v];
			}
        }
        await next()
    }
}