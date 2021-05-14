import { get } from 'http'

export const fetch = async (url: string) => {
    let res = await new Promise<string>(
        (resolve, reject) => {
            get(url, res => {
                let result = '';
                res.on('data', data => { result += data });
                res.on('end', () => { resolve(result) });
                res.on('error', error => { reject(error) })
            })
        }
    );

    return res;
}

export const match = (content: string, tag: string, classes?: Array<string>) => {
    let reg = `<${tag}[\\s\\S]*?${classes ? `class=\"${classes.reduce((sum, item) => `${sum}${sum === '' ? '' : ' '}${item}`, '')}` : ''}[\\s\\S]*?<\/${tag}>`
    return content.match(
        new RegExp(reg, 'g')
    )
}