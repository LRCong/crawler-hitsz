import { get } from 'http';
import { URL } from 'url'
import { JSDOM } from 'jsdom';

export const fetch = async (url: string) => {
    let res = await new Promise<string>(
        (resolve, reject) => {
            get(url, res => {
                if (res.statusCode === 404) reject('404')
                let result = '';
                res.on('data', data => { result += data });
                res.on('end', () => { resolve(result) });
                res.on('error', error => { reject(error) })
            })
        }
    );

    return res;
};

const recur = (content: Element, res: { value: string }) => {
    if (content.childElementCount === 0) {
        res.value += `${res.value.endsWith('\n' ? '' : '\n')}${content.innerHTML}`;
        return;
    }

    for (const child of content.children) {
        recur(child, res);
    }
    return;
};

export const getAllText = async (url: string) => {
    const res = { value: '' };
    if (url.search('faculty.hitsz.edu.cn') === -1) {
        const content = await fetch(`http://cs.hitsz.edu.cn/${url.match(/info.*$/g)[0]}`);
        const { document } = (new JSDOM(content)).window
        const form = document.querySelectorAll('form')[1];
        recur(form, res);
    } else {
        const content = await fetch(url);
        const { document } = (new JSDOM(content)).window
        const subContent = await fetch(
            'http://faculty.hitsz.edu.cn/TeacherHome/teacherBody.do?id=' +
            (document.querySelector('.teacher-body').attributes as any)['data-tid'].value
        )
        recur((new JSDOM(subContent)).window.document.body, res);
    }

    return res.value;
};