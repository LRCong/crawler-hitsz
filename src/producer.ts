import { JSDOM } from 'jsdom';
import { fetch, getAllText } from './tool';

const indexUrlIter = function* () {
    const base = 'http://cs.hitsz.edu.cn/szll/qzjs.htm';

    let i = 0;
    while (true) {
        yield i === 0 ? base : base.replace(/.htm$/g, `/${i}.htm`);
        i++;
    }
};

const baseInfoIter = async function* () {
    const indexUrlProducer = indexUrlIter();

    while (true) {
        let content;
        try {
            content = await fetch(indexUrlProducer.next().value);
        } catch (e) {
            return { info: 'no more' };
        }
        const { document } = (new JSDOM(content)).window;

        const values = {
            name: Array.from(document.querySelectorAll('.teacher-name')).map(node => node.innerHTML),
            value: Array.from(document.querySelectorAll('.teacher-box')).map(node => ({
                '任职': node.children[0].children[1].innerHTML.trim(),
                '电话': node.children[1].children[1].innerHTML.trim(),
                '传真': node.children[2].children[1].innerHTML.trim(),
                'Email': node.children[3].children[1].children[0].innerHTML.trim(),
                '研究方向': node.children[4].children[1].innerHTML.trim()
            })),
            url: Array.from(document.querySelectorAll('.teacher-link')).map(node => (node as any).href)
        };

        let n = values.value.length;
        for (let i = 0; i < n; i++) {
            yield {
                '名字': values.name[i],
                ...values.value[i],
                url: values.url[i]
            }
        }
    }
};

export const contentIter = async function* () {
    const baseInfoProducer = baseInfoIter();

    while (true) {
        const { value, done } = await baseInfoProducer.next();
        if (done) return { info: 'no more' };

        const info = {
            ...value,
            '个人简介': await getAllText((value as any).url)
        };

        yield info
    }
}
