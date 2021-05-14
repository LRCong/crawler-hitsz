import { fetch, match } from './tool'

fetch('http://cs.hitsz.edu.cn/szll/qzjs.htm')
    .then(res => match(res, 'div', ['teacher-box']))
    .then(res => match(res[0], 'dl'))
    .then(res => console.log(res))
