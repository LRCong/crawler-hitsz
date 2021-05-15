import { contentIter } from './producer'

const contentUrlProducer = contentIter()

contentUrlProducer.next().then(res => console.log((res.value)))
contentUrlProducer.next().then(res => console.log((res.value)))
contentUrlProducer.next().then(res => console.log((res.value)))