
import { init } from '@cloudbase/node-sdk'
import { contentIter } from './producer'
import { env } from './env.config'

const mainWoker = async () => {
    const contentUrlProducer = contentIter()
    const collection = init(env).database().collection('professor')

    while (true) {
        const thisTemp = contentUrlProducer.next()

        if ((await thisTemp).done) break

        await collection.add((await thisTemp).value)
        console.log(((await thisTemp).value as any)['名字'])
    }
}

mainWoker()